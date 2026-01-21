import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerQueriesRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/queries
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/queries',
    summary: 'List queries',
    description: 'Returns a list of all saved queries.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved queries',
        content: {
          'application/json': {
            schema: z.object({
              queries: z.array(z.object({
                id: z.number().int(),
                name: z.string(),
                description: z.string().optional(),
                query: z.string(),
                team_id: z.number().int().nullable(),
                interval: z.number().int(),
                platform: z.string().optional(),
                min_osquery_version: z.string().optional(),
                automations_enabled: z.boolean(),
                logging: z.string(),
                author_id: z.number().int().optional(),
                author_name: z.string().optional(),
                author_email: z.string().optional(),
                saved: z.boolean(),
                discard_data: z.boolean(),
                observer_can_run: z.boolean(),
                created_at: z.string().datetime(),
                updated_at: z.string().datetime(),
                packs: z.array(z.any()).optional(),
                stats: z.any().optional(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/queries/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/queries/{id}',
    summary: 'Get query',
    description: 'Returns a specific query.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved query',
        content: {
          'application/json': {
            schema: z.object({
              query: z.object({
                id: z.number().int(),
                name: z.string(),
                description: z.string().optional(),
                query: z.string(),
                team_id: z.number().int().nullable(),
                interval: z.number().int(),
                platform: z.string().optional(),
                logging: z.string(),
                created_at: z.string().datetime(),
                updated_at: z.string().datetime(),
              }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/queries/:id/report
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/queries/{id}/report',
    summary: 'Get query report',
    description: 'Returns the results report for a query.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved query report',
        content: {
          'application/json': {
            schema: z.object({
              query_id: z.number().int(),
              results: z.array(z.any()),
              report_clipped: z.boolean(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/queries/:query_id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/queries/{query_id}',
    summary: 'Get host query results',
    description: 'Returns the results of a specific query for a specific host.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
        query_id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host query results',
      },
    },
  });

  // POST /api/v1/fleet/queries
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/queries',
    summary: 'Create query',
    description: 'Creates a new saved query.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'Query name' }),
              query: z.string().openapi({ description: 'SQL query' }),
              description: z.string().optional().openapi({ description: 'Query description' }),
              team_id: z.number().int().optional().openapi({ description: 'Team ID' }),
              interval: z.number().int().optional().openapi({ description: 'Schedule interval in seconds' }),
              platform: z.string().optional().openapi({ description: 'Target platforms' }),
              min_osquery_version: z.string().optional().openapi({ description: 'Minimum osquery version' }),
              automations_enabled: z.boolean().optional().openapi({ description: 'Enable automations' }),
              logging: z.enum(['snapshot', 'differential', 'differential_ignore_removals']).optional().openapi({ description: 'Logging type' }),
              observer_can_run: z.boolean().optional().openapi({ description: 'Allow observers to run' }),
              discard_data: z.boolean().optional().openapi({ description: 'Discard query data' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Query created successfully',
      },
    },
  });

  // PATCH /api/v1/fleet/queries/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/queries/{id}',
    summary: 'Update query',
    description: 'Updates an existing query.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional(),
              query: z.string().optional(),
              description: z.string().optional(),
              interval: z.number().int().optional(),
              platform: z.string().optional(),
              min_osquery_version: z.string().optional(),
              automations_enabled: z.boolean().optional(),
              logging: z.string().optional(),
              observer_can_run: z.boolean().optional(),
              discard_data: z.boolean().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Query updated successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/queries/:name
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/queries/{name}',
    summary: 'Delete query by name',
    description: 'Deletes a query by its name.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        name: z.string().openapi({ description: 'Query name' }),
      }),
    },
    responses: {
      200: {
        description: 'Query deleted successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/queries/id/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/queries/id/{id}',
    summary: 'Delete query by ID',
    description: 'Deletes a query by its ID.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Query deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/queries/delete
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/queries/delete',
    summary: 'Delete multiple queries',
    description: 'Deletes multiple queries by ID.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              ids: z.array(z.number().int()).openapi({ description: 'Query IDs to delete' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Queries deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/queries/:id/run
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/queries/{id}/run',
    summary: 'Run live query',
    description: 'Runs a live query on specified hosts.',
    tags: ['Queries'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Query ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              host_ids: z.array(z.number().int()).optional().openapi({ description: 'Host IDs to target' }),
              label_ids: z.array(z.number().int()).optional().openapi({ description: 'Label IDs to target' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Query results',
        content: {
          'application/json': {
            schema: z.object({
              campaign_id: z.number().int(),
              targeted_host_count: z.number().int(),
              rows: z.array(z.any()),
            }),
          },
        },
      },
    },
  });
}
