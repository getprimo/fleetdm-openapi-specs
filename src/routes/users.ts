import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerUsersRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/users
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/users',
    summary: 'List users',
    description: 'Returns a list of all users.',
    tags: ['Users'],
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
        description: 'Successfully retrieved users',
        content: {
          'application/json': {
            schema: z.object({
              users: z.array(z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                enabled: z.boolean(),
                force_password_reset: z.boolean(),
                gravatar_url: z.string(),
                sso_enabled: z.boolean(),
                mfa_enabled: z.boolean().optional(),
                global_role: z.string().nullable(),
                teams: z.array(z.any()),
                created_at: z.string(),
                updated_at: z.string(),
              })),
            }),
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/users/admin
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/users/admin',
    summary: 'Create admin user',
    description: 'Creates a new user with admin privileges.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'User name' }),
              email: z.string().email().openapi({ description: 'User email' }),
              password: z.string().optional().openapi({ description: 'User password' }),
              sso_enabled: z.boolean().optional().openapi({ description: 'Enable SSO' }),
              api_only: z.boolean().optional().openapi({ description: 'API-only user' }),
              global_role: z.string().optional().openapi({ description: 'Global role' }),
              teams: z.array(z.object({
                id: z.number().int(),
                role: z.string(),
              })).optional().openapi({ description: 'Team assignments' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User created successfully',
      },
    },
  });

  // POST /api/v1/fleet/users
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/users',
    summary: 'Create user (via invite)',
    description: 'Creates a new user by accepting an invite.',
    tags: ['Users'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'User name' }),
              email: z.string().email().openapi({ description: 'User email' }),
              password: z.string().openapi({ description: 'User password' }),
              invite_token: z.string().openapi({ description: 'Invite token' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User created successfully',
      },
    },
  });

  // GET /api/v1/fleet/users/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/users/{id}',
    summary: 'Get user',
    description: 'Returns a specific user.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved user',
        content: {
          'application/json': {
            schema: z.object({
              user: z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                enabled: z.boolean(),
                force_password_reset: z.boolean(),
                gravatar_url: z.string(),
                sso_enabled: z.boolean(),
                mfa_enabled: z.boolean().optional(),
                global_role: z.string().nullable(),
                teams: z.array(z.any()),
                created_at: z.string(),
                updated_at: z.string(),
              }),
            }),
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/users/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/users/{id}',
    summary: 'Update user',
    description: 'Updates an existing user.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional().openapi({ description: 'User name' }),
              email: z.string().email().optional().openapi({ description: 'User email' }),
              password: z.string().optional().openapi({ description: 'New password' }),
              sso_enabled: z.boolean().optional().openapi({ description: 'Enable SSO' }),
              api_only: z.boolean().optional().openapi({ description: 'API-only user' }),
              global_role: z.string().nullable().optional().openapi({ description: 'Global role' }),
              teams: z.array(z.object({
                id: z.number().int(),
                role: z.string(),
              })).optional().openapi({ description: 'Team assignments' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User updated successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/users/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/users/{id}',
    summary: 'Delete user',
    description: 'Deletes a user.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
    },
    responses: {
      200: {
        description: 'User deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/users/:id/require_password_reset
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/users/{id}/require_password_reset',
    summary: 'Require password reset',
    description: 'Forces a user to reset their password on next login.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              require: z.boolean().openapi({ description: 'Whether to require password reset' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset requirement set',
      },
    },
  });

  // GET /api/v1/fleet/users/:id/sessions
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/users/{id}/sessions',
    summary: 'Get user sessions',
    description: 'Returns all sessions for a user.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved sessions',
        content: {
          'application/json': {
            schema: z.object({
              sessions: z.array(z.object({
                session_id: z.number().int(),
                user_id: z.number().int(),
                created_at: z.string(),
              })),
            }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/users/:id/sessions
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/users/{id}/sessions',
    summary: 'Delete user sessions',
    description: 'Deletes all sessions for a user.',
    tags: ['Users'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'User ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Sessions deleted successfully',
      },
    },
  });
}
