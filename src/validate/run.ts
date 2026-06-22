/**
 * Live schema check for Fleet endpoints.
 *
 *   npm run validate           hit the live API, fail (exit 1) if the response
 *                              no longer matches the committed schema (CI gate).
 *   npm run validate -- --write  re-infer schemas from live and patch the spec
 *                              in place (used by the autonomy workflow to open
 *                              a PR when the diff is non-empty).
 *
 * Read-only: only GET probes are ever sent.
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PROBES, type Probe } from './probes';
import { infer } from './infer';

const SPEC_PATH = path.join(__dirname, '..', '..', 'fleet-openapi.json');

function buildUrl(base: string, version: string, probe: Probe): string {
  const livePath = probe.specPath.replace(/^\/api\/v1\//, `/api/${version}/`);
  const url = new URL(base.replace(/\/$/, '') + livePath);
  for (const [k, v] of Object.entries(probe.query ?? {})) url.searchParams.set(k, String(v));
  return url.toString();
}

/** Component name backing this probe's 200 (or first 2xx) response. */
function responseComponent(spec: any, probe: Probe): string {
  const op = spec.paths?.[probe.specPath]?.[probe.method];
  const responses = op?.responses ?? {};
  const status = responses['200'] ? '200' : Object.keys(responses).find((c) => c.startsWith('2'));
  const ref = status && responses[status]?.content?.['application/json']?.schema?.$ref;
  if (!ref) throw new Error(`No 2xx JSON $ref response for ${probe.specPath}`);
  return ref.split('/').pop()!;
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

  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  let drift = false;

  for (const probe of PROBES) {
    const url = buildUrl(base, version, probe);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error(`✗ ${probe.name}: HTTP ${res.status} ${res.statusText} (${url})`);
      drift = true;
      continue;
    }
    const body = await res.json();
    const inferred = infer([body]);
    const component = responseComponent(spec, probe);
    const committed = spec.components.schemas[component];

    if (stable(inferred) === stable(committed)) {
      console.log(`✓ ${probe.name}: live response matches ${component}`);
      continue;
    }

    drift = true;
    const changes = diff(committed, inferred);
    console.log(`${write ? '↻' : '✗'} ${probe.name}: ${component} drifted (${changes.length} change(s))`);
    for (const c of changes.slice(0, 40)) console.log(`    ${c}`);
    if (changes.length > 40) console.log(`    … ${changes.length - 40} more`);
    if (write) spec.components.schemas[component] = inferred;
  }

  if (write) {
    fs.writeFileSync(SPEC_PATH, JSON.stringify(spec, null, 2) + '\n');
    console.log(`\nWrote inferred schemas to ${path.basename(SPEC_PATH)}.`);
    process.exit(0);
  }
  process.exit(drift ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
