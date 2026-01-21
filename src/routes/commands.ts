import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerCommandsRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/commands/run
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/commands/run',
    summary: 'Run custom MDM command',
    description: 'Sends a custom MDM command to a host.',
    tags: ['Commands'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              command: z.string().openapi({ description: 'Base64-encoded MDM command XML' }),
              host_uuids: z.array(z.string()).openapi({ description: 'Target host UUIDs' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Command sent successfully',
        content: {
          'application/json': {
            schema: z.object({
              command_uuid: z.string().openapi({ description: 'UUID of the sent command' }),
              request_type: z.string().openapi({ description: 'MDM command type' }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/commands/results
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/commands/results',
    summary: 'Get custom MDM command results',
    description: 'Returns the results of a custom MDM command.',
    tags: ['Commands'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        command_uuid: z.string().openapi({ description: 'Command UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Command results retrieved',
        content: {
          'application/json': {
            schema: z.object({
              results: z.array(z.object({
                host_uuid: z.string(),
                command_uuid: z.string(),
                status: z.string(),
                updated_at: z.string().datetime(),
                request_type: z.string(),
                hostname: z.string(),
                result: z.any(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/commands
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/commands',
    summary: 'List custom MDM commands',
    description: 'Returns a list of custom MDM commands.',
    tags: ['Commands'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
      }),
    },
    responses: {
      200: {
        description: 'Commands list retrieved',
        content: {
          'application/json': {
            schema: z.object({
              commands: z.array(z.object({
                command_uuid: z.string(),
                request_type: z.string(),
                status: z.string(),
                hostname: z.string(),
                host_uuid: z.string(),
                updated_at: z.string().datetime(),
              })),
            }),
          },
        },
      },
    },
  });
}
