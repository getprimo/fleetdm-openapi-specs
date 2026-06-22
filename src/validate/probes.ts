/**
 * The manifest: GET-only, read-only probes run against a live Fleet instance.
 *
 * This list is the single source of structure. The whole OpenAPI spec
 * (paths, parameters and response components) is *generated* from these
 * entries plus the shapes inferred from live responses — nothing is hand
 * maintained in fleet-openapi.json.
 *
 * Paths are written canonically as `/api/v1/...`; the runner rewrites the
 * version segment to FLEET_API_VERSION for the live call.
 *
 * Path parameters are resolved by chaining: a probe declares where each
 * `{param}` comes from — value(s) picked out of another probe's live response.
 * The runner fetches dependencies first, so `/hosts/{id}` is driven by real ids
 * taken from the `/hosts` list. A `*` segment fans out: `hosts.*.id` yields every
 * host id, the probe is sampled against each, and the responses are merged into
 * one schema — so per-object nullability/optionality is captured rather than
 * guessed from a single response. Add an endpoint by appending one entry here.
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

export const PROBES: Probe[] = [
  {
    name: 'list-hosts',
    method: 'get',
    specPath: '/api/v1/fleet/hosts',
    summary: 'List hosts',
    tags: ['Hosts'],
    query: { per_page: 5 },
  },
  {
    name: 'get-host',
    method: 'get',
    specPath: '/api/v1/fleet/hosts/{id}',
    summary: 'Get host by id',
    tags: ['Hosts'],
    responseName: 'GetHostResponse',
    params: { id: { from: 'list-hosts', pick: 'hosts.*.id' } },
  },
  {
    name: 'get-host-by-identifier',
    method: 'get',
    specPath: '/api/v1/fleet/hosts/identifier/{identifier}',
    summary: 'Get host by identifier',
    tags: ['Hosts'],
    responseName: 'GetHostResponse',
    params: { identifier: { from: 'list-hosts', pick: 'hosts.*.uuid' } },
  },
  {
    name: 'host-software',
    method: 'get',
    specPath: '/api/v1/fleet/hosts/{id}/software',
    summary: 'List software installed on a host',
    tags: ['Software'],
    params: { id: { from: 'list-hosts', pick: 'hosts.*.id' } },
    query: { per_page: 5 },
  },
  {
    name: 'host-activities',
    method: 'get',
    specPath: '/api/v1/fleet/hosts/{id}/activities',
    summary: 'List activities for a host',
    tags: ['Activities'],
    params: { id: { from: 'list-hosts', pick: 'hosts.*.id' } },
    query: { per_page: 5 },
  },
];
