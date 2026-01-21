import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  ListCarvesResponseSchema,
  GetCarveResponseSchema,
  GetCarveBlockResponseSchema,
} from '../schemas/carves';

export function registerCarvesRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/carves
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/carves',
    summary: 'List file carving sessions',
    description: 'Returns a list of file carving sessions.',
    tags: ['File Carving'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        expired: z.coerce.boolean().optional().openapi({ description: 'Include expired carves' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved carves',
        content: {
          'application/json': {
            schema: ListCarvesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/carves/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/carves/{id}',
    summary: 'Get file carving session',
    description: 'Returns a specific file carving session.',
    tags: ['File Carving'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Carve session ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved carve',
        content: {
          'application/json': {
            schema: GetCarveResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/carves/:id/block/:block_id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/carves/{id}/block/{block_id}',
    summary: 'Get carve block',
    description: 'Returns a specific block from a file carving session.',
    tags: ['File Carving'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Carve session ID' }),
        block_id: z.coerce.number().int().openapi({ description: 'Block ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved carve block',
        content: {
          'application/json': {
            schema: GetCarveBlockResponseSchema,
          },
        },
      },
    },
  });
}
