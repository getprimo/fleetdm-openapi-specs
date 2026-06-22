/**
 * GET-only, read-only probes run against a live Fleet instance.
 *
 * Each probe references a path *as it appears in the spec* (`/api/v1/...`); the
 * runner rewrites the version segment to FLEET_API_VERSION for the live call.
 * Add an endpoint by appending one entry here — nothing else needs to change.
 */
export interface Probe {
  /** Stable identifier used in the report. */
  name: string;
  /** HTTP method (read-only probes only). */
  method: 'get';
  /** Path key exactly as it exists in fleet-openapi.json (uses /api/v1/). */
  specPath: string;
  /** Optional query params appended to the live request. */
  query?: Record<string, string | number | boolean>;
}

export const PROBES: Probe[] = [
  {
    name: 'list-hosts',
    method: 'get',
    specPath: '/api/v1/fleet/hosts',
    // Keep the payload small while still exercising the Host item schema.
    query: { per_page: 5 },
  },
];
