/**
 * Live-driven OpenAPI generator + checker for Fleet endpoints.
 *
 *   npm run validate            hit the live API and fail (exit 1) if any
 *                               response no longer matches the committed spec.
 *   npm run validate -- --write regenerate the spec from the manifest + live
 *                               responses (used by the autonomy workflow to
 *                               open a PR when the diff is non-empty).
 *
 * The whole `paths` and `components.schemas` of fleet-openapi.json are rebuilt
 * from probes.ts + inferred live shapes; the document envelope (info, servers,
 * security scheme) is preserved as-is. Read-only: only GET probes are sent, and
 * path parameters are resolved by chaining values out of other probes (probes.ts).
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PROBES, type Probe } from './probes';
import { infer } from './infer';

const SPEC_PATH = path.join(__dirname, '..', '..', 'fleet-openapi.json');

type ProbeResult =
  | { ok: true; body: any }
  | { ok: false; httpStatus: number }
  | { ok: false; skipped: string };

function pick(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), obj);
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

function buildOperation(probe: Probe, paramTypes: Record<string, string>): any {
  const parameters: any[] = [];
  for (const name of pathParamNames(probe.specPath)) {
    parameters.push({ name, in: 'path', required: true, schema: { type: paramTypes[name] ?? 'string' } });
  }
  for (const [name, value] of Object.entries(probe.query ?? {})) {
    parameters.push({ name, in: 'query', required: false, schema: { type: scalarType(value) } });
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

/** Order-insensitive stable serialization for comparison. */
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

/** Lists changed JSON paths between two schema objects (for human/PR logs). */
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

  /** Fetch a probe (and its dependencies) once, memoized. */
  async function resolve(probe: Probe, stack: Set<string> = new Set()): Promise<ProbeResult> {
    const cached = cache.get(probe.name);
    if (cached) return cached;
    if (stack.has(probe.name)) throw new Error(`Cyclic probe dependency at '${probe.name}'`);
    stack.add(probe.name);

    const params: Record<string, string> = {};
    const types: Record<string, string> = {};
    for (const [name, src] of Object.entries(probe.params ?? {})) {
      const dep = byName.get(src.from);
      if (!dep) return store(probe, { ok: false, skipped: `unknown source '${src.from}'` });
      const depRes = await resolve(dep, stack);
      if (!depRes.ok) return store(probe, { ok: false, skipped: `source '${src.from}' unavailable` });
      const value = pick(depRes.body, src.pick);
      if (value === undefined || value === null)
        return store(probe, { ok: false, skipped: `no value at '${src.pick}' in '${src.from}'` });
      params[name] = String(value);
      types[name] = scalarType(value);
    }
    paramTypes.set(probe.name, types);

    const livePath = probe.specPath.replace(/^\/api\/v1\//, `/api/${version}/`);
    const url = new URL(base!.replace(/\/$/, '') + applyParams(livePath, params));
    for (const [k, v] of Object.entries(probe.query ?? {})) url.searchParams.set(k, String(v));
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return store(probe, { ok: false, httpStatus: res.status });
    return store(probe, { ok: true, body: await res.json() });
  }
  const applyParams = (p: string, params: Record<string, string>): string =>
    Object.entries(params).reduce((acc, [k, v]) => acc.replace(`{${k}}`, encodeURIComponent(v)), p);

  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const prevSchemas: Record<string, any> = spec.components?.schemas ?? {};
  const nextPaths: Record<string, any> = {};
  const nextSchemas: Record<string, any> = {};
  let drift = false;

  for (const probe of PROBES) {
    const result = await resolve(probe);
    if (!result.ok) {
      if ('skipped' in result) {
        console.log(`• ${probe.name}: skipped (${result.skipped})`);
      } else {
        console.error(`✗ ${probe.name}: HTTP ${result.httpStatus}`);
        drift = true;
      }
      continue;
    }

    const component = componentName(probe);
    const inferred = infer([result.body]);
    nextSchemas[component] = inferred;
    (nextPaths[probe.specPath] ??= {})[probe.method] = buildOperation(probe, paramTypes.get(probe.name) ?? {});

    if (stable(inferred) === stable(prevSchemas[component])) {
      console.log(`✓ ${probe.name}: live response matches ${component}`);
      continue;
    }
    drift = true;
    const changes = diff(prevSchemas[component], inferred);
    console.log(`${write ? '↻' : '✗'} ${probe.name}: ${component} drifted (${changes.length} change(s))`);
    for (const c of changes.slice(0, 40)) console.log(`    ${c}`);
    if (changes.length > 40) console.log(`    … ${changes.length - 40} more`);
  }

  if (write) {
    spec.paths = nextPaths;
    spec.components = { ...spec.components, schemas: nextSchemas };
    fs.writeFileSync(SPEC_PATH, JSON.stringify(spec, null, 2) + '\n');
    console.log(`\nGenerated ${Object.keys(nextPaths).length} path(s) into ${path.basename(SPEC_PATH)}.`);
    process.exit(0);
  }
  process.exit(drift ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
