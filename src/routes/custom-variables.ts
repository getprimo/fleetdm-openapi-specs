import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerCustomVariablesRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/custom_variables
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/custom_variables',
    summary: 'List custom variables',
    description: 'Returns a list of all custom variables.',
    tags: ['Custom Variables'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved custom variables',
        content: {
          'application/json': {
            schema: z.object({
              custom_variables: z.array(z.object({
                id: z.number().int(),
                name: z.string(),
                value: z.string(),
                created_at: z.string(),
                updated_at: z.string(),
              })),
            }),
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/custom_variables
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/custom_variables',
    summary: 'Create custom variable',
    description: 'Creates a new custom variable.',
    tags: ['Custom Variables'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'Variable name' }),
              value: z.string().openapi({ description: 'Variable value' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Custom variable created successfully',
        content: {
          'application/json': {
            schema: z.object({
              custom_variable: z.object({
                id: z.number().int(),
                name: z.string(),
                value: z.string(),
                created_at: z.string(),
                updated_at: z.string(),
              }),
            }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/custom_variables/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/custom_variables/{id}',
    summary: 'Delete custom variable',
    description: 'Deletes a custom variable.',
    tags: ['Custom Variables'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Custom variable ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Custom variable deleted successfully',
      },
    },
  });
}
