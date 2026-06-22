/**
 * Deterministic extraction of endpoint parameters from Fleet's canonical REST
 * API documentation (docs/REST API/rest-api.md). The doc is the source for the
 * *input contract* (query params, path-param descriptions) — things the live
 * API can never reveal, since a response only reflects what was sent.
 *
 * No AI here: Fleet documents parameters as regular markdown tables
 * (`| Name | Type | In | Description |`), which a parser reads reliably.
 */
const DOCS_REF = process.env.FLEET_DOCS_REF || 'main';
const DOCS_URL = `https://raw.githubusercontent.com/fleetdm/fleet/${DOCS_REF}/docs/REST%20API/rest-api.md`;

export interface DocParam {
  name: string;
  in: 'query' | 'path' | 'body' | 'header' | string;
  type: 'integer' | 'number' | 'boolean' | 'array' | 'object' | 'string';
  required: boolean;
  description?: string;
}

export async function fetchDocs(): Promise<string> {
  const res = await fetch(DOCS_URL);
  if (!res.ok) throw new Error(`Failed to fetch Fleet docs (HTTP ${res.status}) from ${DOCS_URL}`);
  return res.text();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeType(raw: string): DocParam['type'] {
  const t = (raw || '').toLowerCase().replace(/[`*]/g, '').trim().split(/[\s,/]/)[0];
  if (t === 'integer') return 'integer';
  if (t === 'number' || t === 'float') return 'number';
  if (t === 'boolean' || t === 'bool') return 'boolean';
  if (t === 'array' || t === 'list') return 'array';
  if (t === 'object') return 'object';
  return 'string';
}

function clean(cell: string): string {
  return (cell || '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function cleanName(cell: string): string {
  const m = clean(cell).match(/[a-zA-Z_][\w]*/);
  return m ? m[0] : '';
}

/** Parse a contiguous markdown table into header-keyed row objects. */
function parseTable(lines: string[]): Record<string, string>[] {
  if (lines.length < 2) return [];
  const cols = lines[0].split('|').map((c) => clean(c).toLowerCase());
  const rows: Record<string, string>[] = [];
  for (const line of lines.slice(2)) {
    const cells = line.split('|');
    const row: Record<string, string> = {};
    cols.forEach((col, i) => col && (row[col] = (cells[i] ?? '').trim()));
    rows.push(row);
  }
  return rows;
}

/**
 * Extract the parameters documented for `METHOD specPath`. `specPath` uses the
 * OpenAPI `{id}` form; the doc uses `:id`. Returns [] when the endpoint or its
 * parameter table is not found.
 */
export function extractParams(md: string, method: string, specPath: string): DocParam[] {
  const docPath = specPath.replace(/\{(\w+)\}/g, ':$1');
  const lines = md.split('\n');
  const anchor = new RegExp(`\\b${method.toUpperCase()}\\s+${escapeRegExp(docPath)}(?![\\w/-])`);
  const start = lines.findIndex((l) => anchor.test(l));
  if (start < 0) return [];

  // Window: until the next endpoint heading (### …) or end of file.
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^###\s/.test(lines[i])) {
      end = i;
      break;
    }
  }

  // First contiguous table block in the window.
  const block: string[] = [];
  for (let i = start + 1; i < end; i++) {
    const isRow = /^\s*\|/.test(lines[i]);
    if (isRow) block.push(lines[i].trim());
    else if (block.length) break;
  }
  if (!block.length) return [];

  const cols = block[0].split('|').map((c) => clean(c).toLowerCase());
  if (!cols.includes('name')) return [];
  const hasIn = cols.includes('in');

  const out: DocParam[] = [];
  for (const row of parseTable(block)) {
    const name = cleanName(row['name']);
    if (!name) continue;
    // Without an "In" column we cannot classify reliably; skip to avoid guessing.
    const where = hasIn ? clean(row['in']).toLowerCase() : '';
    if (!where) continue;
    const required = /yes|true|required/i.test(row['required'] ?? '') || /required/i.test(row['description'] ?? '');
    out.push({
      name,
      in: where,
      type: normalizeType(row['type']),
      required,
      description: clean(row['description']) || undefined,
    });
  }
  return out;
}
