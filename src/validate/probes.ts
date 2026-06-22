/**
 * Probe types + manual OVERRIDES.
 *
 * The probe list itself is generated from Fleet's docs — see discover.ts, which
 * writes probes.generated.ts. This file holds only the things discovery can't
 * infer: query params to send, chaining the heuristic gets wrong, and endpoints
 * to add or drop.
 */
export interface ParamSource {
  /** Name of the probe whose response supplies the value. */
  from: string;
  /** Dotted path into that response; `*` matches all array elements, e.g. "hosts.*.id". */
  pick: string;
}

export interface Probe {
  /** Stable identifier used in the report and as a chaining source. */
  name: string;
  /** HTTP method (read-only probes only). */
  method: 'get';
  /** Canonical path as it should appear in the spec (uses /api/v1/). */
  specPath: string;
  /** Short human summary for the generated operation. */
  summary: string;
  /** OpenAPI tags for the generated operation. */
  tags: string[];
  /** Component name for the response schema. Defaults to PascalCase(name)+"Response". */
  responseName?: string;
  /** How to fill each path parameter. Omit for paths with no parameters. */
  params?: Record<string, ParamSource>;
  /** Query params sent on the live request (also documented on the operation). */
  query?: Record<string, string | number | boolean>;
}

/**
 * A patch applied to the discovered probe with the same `specPath`:
 *  - `skip: true`  → drop the endpoint
 *  - matching path → shallow-merge the given fields onto the discovered probe
 *  - no match      → add it as a brand-new probe (must be a complete Probe)
 */
export type ProbeOverride = Partial<Probe> & { specPath: string; skip?: boolean };

export const OVERRIDES: ProbeOverride[] = [
  // Keep payloads small and exercise pagination params on list endpoints.
  { specPath: '/api/v1/fleet/hosts', query: { per_page: 5 } },
  { specPath: '/api/v1/fleet/hosts/{id}/software', query: { per_page: 5 } },
  { specPath: '/api/v1/fleet/hosts/{id}/activities', query: { per_page: 5 } },
  // The heuristic can't chain `identifier` (no /hosts/identifier collection);
  // source it from a host's uuid in the /hosts list.
  {
    name: 'hosts-identifier-by-identifier',
    method: 'get',
    specPath: '/api/v1/fleet/hosts/identifier/{identifier}',
    summary: 'Get host by identifier',
    tags: ['Hosts'],
    responseName: 'HostsByIdResponse',
    params: { identifier: { from: 'hosts', pick: 'hosts.*.uuid' } },
  },
];
