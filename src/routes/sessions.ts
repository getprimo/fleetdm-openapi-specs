import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerSessionsRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/sessions/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/sessions/{id}',
    summary: 'Get session',
    description: 'Returns session information.',
    tags: ['Sessions'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Session ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved session',
        content: {
          'application/json': {
            schema: z.object({
              session_id: z.number().int(),
              user_id: z.number().int(),
              created_at: z.string().datetime(),
            }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/sessions/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/sessions/{id}',
    summary: 'Delete session',
    description: 'Deletes (invalidates) a session.',
    tags: ['Sessions'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Session ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Session deleted successfully',
      },
    },
  });
}
