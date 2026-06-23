/**
 * Live-driven OpenAPI generator + checker for Fleet endpoints.
 *
 *   npm run validate            hit the live API and fail (exit 1) if any live
 *                               response does not *conform* to the committed
 *                               schema (CI gate — tolerant of additive fields).
 *   npm run validate -- --write regenerate the spec from the manifest + live
 *                               responses (used by the autonomy workflow to
 *                               open a PR when the diff is non-empty).
 *
 * The whole `paths` and `components.schemas` of fleet-openapi.json are rebuilt
 * from probes.ts + inferred live shapes; the document envelope (info, servers,
 * security scheme) is preserved as-is. Read-only: only GET probes are sent.
 *
 * Path parameters are resolved by chaining (probes.ts). A `*` in a pick fans the
 * probe out across every matching value; the responses are merged so nullability
 * and optionality are observed across many objects, not guessed from one.
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { type Probe } from './probes';
import { PROBES } from './probes.generated';
import { infer, mergeSchemas } from './infer';
import { fetchDocs, extractParams, type DocParam } from './docs';

const SPEC_PATH = path.join(__dirname, '..', '..', 'fleet-openapi.json');
const MAX_SAMPLES = 5;

type ProbeResult =
  | { ok: true; bodies: any[] }
  | { ok: false; httpStatus: number }
  | { ok: false; skipped: string };

/** Resolve a dotted path into all matching values. `*` matches every array element. */
function pickAll(obj: unknown, dotted: string): unknown[] {
  let current: any[] = [obj];
  for (const seg of dotted.split('.')) {
    const next: any[] = [];
    for (const node of current) {
      if (node == null) continue;
      if (seg === '*') {
        if (Array.isArray(node)) next.push(...node);
      } else {
        next.push(node[seg]);
      }
    }
    current = next;
  }
  return current.filter((v) => v !== undefined && v !== null);
}

function pascal(s: string): string {
  return s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
}

function componentName(probe: Probe): string {
  return probe.responseName ?? `${pascal(probe.name)}Response`;
}

function pathParamNames(specPath: string): string[] {
  return [...specPath.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

function scalarType(v: unknown): 'integer' | 'number' | 'boolean' | 'string' {
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return 'string';
}

function buildOperation(probe: Probe, paramTypes: Record<string, string>, docParams: DocParam[]): any {
  const find = (where: string, name: string) => docParams.find((p) => p.in === where && p.name === name);
  const parameters: any[] = [];

  // Path params: names from the URL, types/descriptions enriched from the docs.
  for (const name of pathParamNames(probe.specPath)) {
    const d = find('path', name);
    const param: any = { name, in: 'path', required: true, schema: { type: d?.type ?? paramTypes[name] ?? 'string' } };
    if (d?.description) param.description = d.description;
    parameters.push(param);
  }

  // Query params: the full documented set, unioned with whatever we actually send.
  const queryNames = new Set<string>([
    ...docParams.filter((p) => p.in === 'query').map((p) => p.name),
    ...Object.keys(probe.query ?? {}),
  ]);
  for (const name of [...queryNames].sort()) {
    const d = find('query', name);
    const param: any = {
      name,
      in: 'query',
      required: d?.required ?? false,
      schema: { type: d?.type ?? scalarType((probe.query ?? {})[name]) },
    };
    if (d?.description) param.description = d.description;
    parameters.push(param);
  }

  const op: any = {
    tags: probe.tags,
    summary: probe.summary,
    security: [{ BearerAuth: [] }],
    responses: {
      '200': {
        description: 'Successful response',
        content: { 'application/json': { schema: { $ref: `#/components/schemas/${componentName(probe)}` } } },
      },
    },
  };
  if (parameters.length) op.parameters = parameters;
  return op;
}

/** Stable serialization (order-insensitive) for change reporting. */
function stable(o: unknown): string {
  if (Array.isArray(o)) return `[${o.map(stable).join(',')}]`;
  if (o && typeof o === 'object') {
    return `{${Object.keys(o as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable((o as any)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(o);
}

/** Lists changed JSON paths between two schema objects (for --write logs). */
function diff(a: any, b: any, p = '$', out: string[] = []): string[] {
  if (stable(a) === stable(b)) return out;
  const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
  if (isObj(a) && isObj(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) out.push(`+ ${p}.${k}`);
      else if (!(k in b)) out.push(`- ${p}.${k}`);
      else diff(a[k], b[k], `${p}.${k}`, out);
    }
  } else {
    out.push(`~ ${p}: ${stable(a)} -> ${stable(b)}`);
  }
  return out;
}

/**
 * Loosen a committed schema for the cross-instance check gate. Different Fleet
 * instances expose different data, so the gate must tolerate that variance and
 * only flag genuinely incompatible drift:
 *   - drop `required` — a field's presence depends on the instance's data;
 *   - a field we only ever observed as `null` carries no real type info, so
 *     accept anything for it (another instance may populate it).
 * Positive type constraints on populated fields are kept, so a real conflict
 * (spec says object, live sends string) still fails the gate.
 */
function relax(schema: any): any {
  if (Array.isArray(schema)) return schema.map(relax);
  if (!schema || typeof schema !== 'object') return schema;
  if (schema.type === 'null') return {};
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'required') continue;
    out[k] = relax(v);
  }
  return out;
}

async function main(): Promise<void> {
  const write = process.argv.includes('--write');
  const base = process.env.FLEET_URL;
  const token = process.env.FLEET_TOKEN;
  const version = process.env.FLEET_API_VERSION || 'latest';
  if (!base || !token) {
    console.error('FLEET_URL and FLEET_TOKEN are required (see .env.example).');
    process.exit(2);
  }

  const byName = new Map(PROBES.map((p) => [p.name, p]));
  const cache = new Map<string, ProbeResult>();
  const paramTypes = new Map<string, Record<string, string>>();
  const store = (probe: Probe, r: ProbeResult): ProbeResult => (cache.set(probe.name, r), r);
  const applyParams = (p: string, params: Record<string, string>): string =>
    Object.entries(params).reduce((acc, [k, v]) => acc.replace(`{${k}}`, encodeURIComponent(v)), p);

  /** Fetch a probe (and its dependencies) once, memoized. Fans out on `*` picks. */
  async function resolve(probe: Probe, stack: Set<string> = new Set()): Promise<ProbeResult> {
    const cached = cache.get(probe.name);
    if (cached) return cached;
    if (stack.has(probe.name)) throw new Error(`Cyclic probe dependency at '${probe.name}'`);
    stack.add(probe.name);

    // Resolve each path parameter to its candidate value(s).
    const candidates: Record<string, string[]> = {};
    const types: Record<string, string> = {};
    for (const [name, src] of Object.entries(probe.params ?? {})) {
      const dep = byName.get(src.from);
      if (!dep) return store(probe, { ok: false, skipped: `unknown source '${src.from}'` });
      const depRes = await resolve(dep, stack);
      if (!depRes.ok) return store(probe, { ok: false, skipped: `source '${src.from}' unavailable` });
      const values = pickAll(depRes.bodies[0], src.pick);
      if (!values.length) return store(probe, { ok: false, skipped: `no value at '${src.pick}' in '${src.from}'` });
      types[name] = scalarType(values[0]);
      candidates[name] = values.slice(0, MAX_SAMPLES).map(String);
    }
    paramTypes.set(probe.name, types);

    // Cartesian product of candidates, capped at MAX_SAMPLES requests.
    let combos: Record<string, string>[] = [{}];
    for (const [name, values] of Object.entries(candidates)) {
      combos = combos.flatMap((c) => values.map((v) => ({ ...c, [name]: v })));
    }
    combos = combos.slice(0, MAX_SAMPLES);

    const bodies: any[] = [];
    let lastHttp = 0;
    for (const combo of combos) {
      const livePath = applyParams(probe.specPath.replace(/^\/api\/v1\//, `/api/${version}/`), combo);
      const url = new URL(base!.replace(/\/$/, '') + livePath);
      for (const [k, v] of Object.entries(probe.query ?? {})) url.searchParams.set(k, String(v));
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        lastHttp = res.status;
        continue;
      }
      try {
        bodies.push(await res.json());
      } catch {
        // Non-JSON response (CSV/binary export, etc.) — not a schema we model.
      }
    }
    if (!bodies.length) return store(probe, { ok: false, httpStatus: lastHttp });
    return store(probe, { ok: true, bodies });
  }

  // The input contract (query params, path-param docs) comes from Fleet's docs,
  // which the live API can't reveal. Only needed when regenerating the spec.
  let docs: string | null = null;
  if (write) {
    try {
      docs = await fetchDocs();
    } catch (err) {
      console.warn(`⚠ ${(err as Error).message} — query params limited to sampled values.`);
    }
  }

  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const prevSchemas: Record<string, any> = spec.components?.schemas ?? {};
  // Seed from the committed spec so a single run only ever adds/widens — it
  // never drops endpoints it couldn't probe (403/404) or schemas it didn't see.
  const nextPaths: Record<string, any> = write ? { ...(spec.paths ?? {}) } : {};
  const nextSchemas: Record<string, any> = write ? { ...prevSchemas } : {};
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  let failed = false;

  for (const probe of PROBES) {
    const result = await resolve(probe);
    const component = componentName(probe);

    if (!result.ok) {
      if ('skipped' in result) {
        console.log(`• ${probe.name}: skipped (${result.skipped})`);
      } else {
        // Not probeable on this instance (feature off, permissions, no resource).
        // The spec only documents 200s, so this is environmental, not drift —
        // report it but don't fail the gate (instances legitimately differ).
        console.warn(`⚠ ${probe.name}: HTTP ${result.httpStatus} (not probeable here)`);
      }
      continue;
    }

    if (write) {
      const inferred = infer(result.bodies);
      // Merge against the run-so-far schema, not the committed one: several probes
      // can share a component (e.g. hosts-by-id and hosts-identifier-by-identifier
      // both → HostsByIdResponse), and each must accumulate rather than clobber.
      const base = nextSchemas[component] ?? prevSchemas[component];
      const merged = base ? mergeSchemas(base, inferred) : inferred;
      const docParams = docs ? extractParams(docs, probe.method, probe.specPath) : [];
      nextSchemas[component] = merged;
      (nextPaths[probe.specPath] ??= {})[probe.method] = buildOperation(probe, paramTypes.get(probe.name) ?? {}, docParams);
      const changes = diff(prevSchemas[component], merged);
      if (changes.length) {
        console.log(`↻ ${probe.name}: ${component} (${changes.length} change(s), ${result.bodies.length} sample(s))`);
        for (const c of changes.slice(0, 30)) console.log(`    ${c}`);
        if (changes.length > 30) console.log(`    … ${changes.length - 30} more`);
      } else {
        console.log(`✓ ${probe.name}: ${component} unchanged`);
      }
      continue;
    }

    // Check mode: every live sample must conform to the committed schema.
    const committed = prevSchemas[component];
    if (!committed) {
      console.error(`✗ ${probe.name}: ${component} is not in the committed spec`);
      failed = true;
      continue;
    }
    const validate = ajv.compile(relax(committed));
    const errors = result.bodies.flatMap((body) => (validate(body) ? [] : validate.errors ?? []));
    if (errors.length) {
      failed = true;
      console.error(`✗ ${probe.name}: ${errors.length} conformance error(s) vs ${component}`);
      for (const e of errors.slice(0, 20)) console.error(`    ${e.instancePath || '$'} ${e.message}`);
      if (errors.length > 20) console.error(`    … ${errors.length - 20} more`);
    } else {
      console.log(`✓ ${probe.name}: ${result.bodies.length} live sample(s) conform to ${component}`);
    }
  }

  if (write) {
    spec.paths = nextPaths;
    spec.components = { ...spec.components, schemas: nextSchemas };
    // Stamp the live Fleet version into the document envelope. The `version`
    // probe (GET /fleet/version) is already fetched above, so reuse its body
    // rather than calling the endpoint again.
    const versionRes = cache.get('version');
    if (versionRes?.ok && versionRes.bodies[0]?.version) {
      const v = versionRes.bodies[0];
      spec.info = {
        ...spec.info,
        version: v.version,
        'x-fleet-revision': v.revision,
        'x-fleet-build-date': v.build_date,
      };
    }
    fs.writeFileSync(SPEC_PATH, JSON.stringify(spec, null, 2) + '\n');
    console.log(`\nGenerated ${Object.keys(nextPaths).length} path(s) into ${path.basename(SPEC_PATH)}.`);
    process.exit(0);
  }
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
