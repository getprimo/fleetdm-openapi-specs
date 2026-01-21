import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  CreateLabelRequestSchema,
  CreateLabelResponseSchema,
  UpdateLabelRequestSchema,
  ListLabelsResponseSchema,
  GetLabelResponseSchema,
  LabelsSummaryResponseSchema,
} from '../schemas/labels';
import { ListHostsQuerySchema, ListHostsResponseSchema } from '../schemas/hosts';

export function registerLabelsRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/labels
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/labels',
    summary: 'Create label',
    description: 'Creates a new label.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateLabelRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Label created successfully',
        content: {
          'application/json': {
            schema: CreateLabelResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/labels/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/labels/{id}',
    summary: 'Update label',
    description: 'Updates an existing label.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Label ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateLabelRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Label updated successfully',
        content: {
          'application/json': {
            schema: GetLabelResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/labels/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/labels/{id}',
    summary: 'Get label',
    description: 'Returns a specific label by ID.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Label ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved label',
        content: {
          'application/json': {
            schema: GetLabelResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/labels/summary
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/labels/summary',
    summary: 'Get labels summary',
    description: 'Returns a summary of all labels.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved labels summary',
        content: {
          'application/json': {
            schema: LabelsSummaryResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/labels
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/labels',
    summary: 'List labels',
    description: 'Returns a list of all labels.',
    tags: ['Labels'],
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
        description: 'Successfully retrieved labels',
        content: {
          'application/json': {
            schema: ListLabelsResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/labels/:id/hosts
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/labels/{id}/hosts',
    summary: 'List hosts in label',
    description: 'Returns hosts that belong to the specified label.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Label ID' }),
      }),
      query: ListHostsQuerySchema,
    },
    responses: {
      200: {
        description: 'Successfully retrieved hosts in label',
        content: {
          'application/json': {
            schema: ListHostsResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/labels/:name
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/labels/{name}',
    summary: 'Delete label by name',
    description: 'Deletes a label by its name.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        name: z.string().openapi({ description: 'Label name' }),
      }),
    },
    responses: {
      200: {
        description: 'Label deleted successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/labels/id/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/labels/id/{id}',
    summary: 'Delete label by ID',
    description: 'Deletes a label by its ID.',
    tags: ['Labels'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Label ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Label deleted successfully',
      },
    },
  });
}
