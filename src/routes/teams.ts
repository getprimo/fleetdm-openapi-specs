import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerTeamsRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/teams
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/teams',
    summary: 'List teams',
    description: 'Returns a list of all teams.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved teams',
        content: {
          'application/json': {
            schema: z.object({
              teams: z.array(z.object({
                id: z.number().int(),
                created_at: z.string(),
                name: z.string(),
                description: z.string().optional(),
                agent_options: z.any().nullable(),
                user_count: z.number().int(),
                host_count: z.number().int(),
                secrets: z.array(z.any()).optional(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/teams/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/teams/{id}',
    summary: 'Get team',
    description: 'Returns a specific team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved team',
        content: {
          'application/json': {
            schema: z.object({
              team: z.object({
                id: z.number().int(),
                created_at: z.string(),
                name: z.string(),
                description: z.string().optional(),
                agent_options: z.any().nullable(),
                user_count: z.number().int(),
                host_count: z.number().int(),
                users: z.array(z.any()).optional(),
                secrets: z.array(z.any()).optional(),
              }),
            }),
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/teams
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/teams',
    summary: 'Create team',
    description: 'Creates a new team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'Team name' }),
              description: z.string().optional().openapi({ description: 'Team description' }),
              secrets: z.array(z.object({
                secret: z.string(),
              })).optional().openapi({ description: 'Enroll secrets' }),
              agent_options: z.any().optional().openapi({ description: 'Agent options' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Team created successfully',
      },
    },
  });

  // PATCH /api/v1/fleet/teams/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/teams/{id}',
    summary: 'Update team',
    description: 'Updates an existing team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional().openapi({ description: 'Team name' }),
              description: z.string().optional().openapi({ description: 'Team description' }),
              webhook_settings: z.any().optional().openapi({ description: 'Webhook settings' }),
              integrations: z.any().optional().openapi({ description: 'Integration settings' }),
              mdm: z.any().optional().openapi({ description: 'MDM settings' }),
              host_expiry_settings: z.any().optional().openapi({ description: 'Host expiry settings' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Team updated successfully',
      },
    },
  });

  // PATCH /api/v1/fleet/teams/:id/users
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/teams/{id}/users',
    summary: 'Modify team users',
    description: 'Modifies the users assigned to a team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              users: z.array(z.object({
                id: z.number().int().openapi({ description: 'User ID' }),
                role: z.string().openapi({ description: 'Role (admin, maintainer, observer, observer_plus, gitops)' }),
              })).openapi({ description: 'Users to add/modify' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Team users modified successfully',
      },
    },
  });

  // POST /api/v1/fleet/teams/:id/agent_options
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/teams/{id}/agent_options',
    summary: 'Apply team agent options',
    description: 'Applies agent options to a team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      query: z.object({
        force: z.coerce.boolean().optional().openapi({ description: 'Force apply even with errors' }),
        dry_run: z.coerce.boolean().optional().openapi({ description: 'Validate without applying' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.any().openapi({ description: 'Agent options object' }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Agent options applied successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/teams/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/teams/{id}',
    summary: 'Delete team',
    description: 'Deletes a team.',
    tags: ['Teams'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Team deleted successfully',
      },
    },
  });
}
