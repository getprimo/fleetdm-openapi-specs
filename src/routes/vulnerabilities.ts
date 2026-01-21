import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerVulnerabilitiesRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/vulnerabilities
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/vulnerabilities',
    summary: 'List vulnerabilities',
    description: 'Returns a list of vulnerabilities.',
    tags: ['Vulnerabilities'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        exploit: z.coerce.boolean().optional().openapi({ description: 'Filter to known exploits' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved vulnerabilities',
        content: {
          'application/json': {
            schema: z.object({
              vulnerabilities: z.array(z.object({
                cve: z.string(),
                hosts_count: z.number().int(),
                hosts_count_updated_at: z.string().datetime().nullable(),
                details_link: z.string(),
                cvss_score: z.number().nullable(),
                epss_probability: z.number().nullable(),
                cisa_known_exploit: z.boolean(),
                cve_published: z.string().datetime().nullable(),
                cve_description: z.string().nullable(),
                resolved_in_version: z.string().nullable(),
              })),
              count: z.number().int(),
              counts_updated_at: z.string().datetime().nullable(),
              meta: z.object({
                has_next_results: z.boolean(),
                has_previous_results: z.boolean(),
              }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/vulnerabilities/:cve
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/vulnerabilities/{cve}',
    summary: 'Get vulnerability',
    description: 'Returns details about a specific vulnerability.',
    tags: ['Vulnerabilities'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        cve: z.string().openapi({ description: 'CVE identifier' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved vulnerability',
        content: {
          'application/json': {
            schema: z.object({
              vulnerability: z.object({
                cve: z.string(),
                hosts_count: z.number().int(),
                hosts_count_updated_at: z.string().datetime().nullable(),
                details_link: z.string(),
                cvss_score: z.number().nullable(),
                epss_probability: z.number().nullable(),
                cisa_known_exploit: z.boolean(),
                cve_published: z.string().datetime().nullable(),
                cve_description: z.string().nullable(),
                software: z.array(z.object({
                  id: z.number().int(),
                  name: z.string(),
                  version: z.string(),
                  source: z.string(),
                  hosts_count: z.number().int(),
                  resolved_in_version: z.string().nullable(),
                })),
                os_versions: z.array(z.object({
                  os_version_id: z.number().int(),
                  hosts_count: z.number().int(),
                  name: z.string(),
                  name_only: z.string(),
                  version: z.string(),
                  platform: z.string(),
                  resolved_in_version: z.string().nullable(),
                })),
              }),
            }),
          },
        },
      },
    },
  });
}
