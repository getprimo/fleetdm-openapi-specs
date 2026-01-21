import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerTargetsRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/targets
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/targets',
    summary: 'Search targets',
    description: 'Retrieves the count of targets for a query based on the hosts, labels, and teams.',
    tags: ['Targets'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              query: z.string().optional().openapi({ description: 'SQL query (for validation)' }),
              query_id: z.number().int().optional().openapi({ description: 'Query ID to use' }),
              selected: z.object({
                hosts: z.array(z.number().int()).optional().openapi({ description: 'Selected host IDs' }),
                labels: z.array(z.number().int()).optional().openapi({ description: 'Selected label IDs' }),
                teams: z.array(z.number().int()).optional().openapi({ description: 'Selected team IDs' }),
              }).openapi({ description: 'Selected targets' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully retrieved targets',
        content: {
          'application/json': {
            schema: z.object({
              targets: z.object({
                hosts: z.array(z.object({
                  id: z.number().int(),
                  display_text: z.string(),
                  label: z.string(),
                  status: z.string(),
                  seen_time: z.string().datetime(),
                  platform: z.string(),
                })),
                labels: z.array(z.object({
                  id: z.number().int(),
                  name: z.string(),
                  description: z.string(),
                  label_type: z.string(),
                  count: z.number().int(),
                })),
                teams: z.array(z.object({
                  id: z.number().int(),
                  name: z.string(),
                  count: z.number().int(),
                })),
              }),
              targets_count: z.number().int(),
              targets_online: z.number().int(),
              targets_offline: z.number().int(),
              targets_missing_in_action: z.number().int(),
            }),
          },
        },
      },
    },
  });
}
