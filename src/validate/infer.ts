/**
 * Infers a JSON Schema (OpenAPI 3.1 compatible) from one or more live response
 * samples. Multiple samples are merged so that optionality (required = present
 * in every sample) and nullability (a field seen both null and typed) are
 * derived correctly rather than guessed from a single response.
 */
type Schema = Record<string, any>;

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function scalarType(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return 'string';
}

function inferOne(value: unknown): Schema {
  if (Array.isArray(value)) {
    const items = value.length ? value.map(inferOne).reduce(merge) : undefined;
    return items ? { type: 'array', items } : { type: 'array' };
  }
  if (value !== null && typeof value === 'object') {
    const properties: Schema = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      // JSON never yields `undefined`; treat a stray one as an absent field.
      if (v === undefined) continue;
      properties[k] = inferOne(v);
      required.push(k);
    }
    return { type: 'object', properties, required: required.sort() };
  }
  const type = scalarType(value);
  if (type === 'string' && typeof value === 'string' && ISO_DATE_TIME.test(value)) {
    return { type, format: 'date-time' };
  }
  return { type };
}

function typeSet(s: Schema): Set<string> {
  return new Set(Array.isArray(s.type) ? s.type : s.type ? [s.type] : []);
}

function merge(a: Schema, b: Schema): Schema {
  const types = new Set([...typeSet(a), ...typeSet(b)]);
  if (types.has('integer') && types.has('number')) types.delete('integer');
  const out: Schema = {};
  out.type = types.size <= 1 ? [...types][0] : [...types].sort();

  // Objects: union of properties, required = intersection (present everywhere).
  if (types.has('object') && (a.properties || b.properties)) {
    const aProps = a.properties ?? {};
    const bProps = b.properties ?? {};
    const properties: Schema = {};
    for (const key of new Set([...Object.keys(aProps), ...Object.keys(bProps)])) {
      properties[key] =
        key in aProps && key in bProps ? merge(aProps[key], bProps[key]) : aProps[key] ?? bProps[key];
    }
    out.properties = properties;
    const aReq = new Set(a.required ?? []);
    out.required = [...(b.required ?? [])].filter((k: string) => aReq.has(k)).sort();
  }

  if (types.has('array') && (a.items || b.items)) {
    out.items = a.items && b.items ? merge(a.items, b.items) : a.items ?? b.items;
  }

  if (a.format && a.format === b.format) out.format = a.format;
  return out;
}

export function infer(samples: unknown[]): Schema {
  return samples.map(inferOne).reduce(merge);
}
