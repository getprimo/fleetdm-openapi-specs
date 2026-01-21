import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerInvitesRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/invites
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/invites',
    summary: 'Create invite',
    description: 'Creates a new invite for a user.',
    tags: ['Invites'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'Invited user name' }),
              email: z.string().email().openapi({ description: 'Invited user email' }),
              global_role: z.string().nullable().optional().openapi({ description: 'Global role' }),
              teams: z.array(z.object({
                id: z.number().int().openapi({ description: 'Team ID' }),
                role: z.string().openapi({ description: 'Role in the team' }),
              })).optional().openapi({ description: 'Team assignments' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Invite created successfully',
        content: {
          'application/json': {
            schema: z.object({
              invite: z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                created_at: z.string(),
                token: z.string(),
                global_role: z.string().nullable(),
                teams: z.array(z.any()),
              }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/invites
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/invites',
    summary: 'List invites',
    description: 'Returns a list of all pending invites.',
    tags: ['Invites'],
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
        description: 'Successfully retrieved invites',
        content: {
          'application/json': {
            schema: z.object({
              invites: z.array(z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                created_at: z.string(),
                global_role: z.string().nullable(),
                teams: z.array(z.any()),
              })),
            }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/invites/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/invites/{id}',
    summary: 'Delete invite',
    description: 'Deletes a pending invite.',
    tags: ['Invites'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Invite ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Invite deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/invites/:token
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/invites/{token}',
    summary: 'Verify invite',
    description: 'Verifies an invite token and returns invite information.',
    tags: ['Invites'],
    request: {
      params: z.object({
        token: z.string().openapi({ description: 'Invite token' }),
      }),
    },
    responses: {
      200: {
        description: 'Invite verified',
        content: {
          'application/json': {
            schema: z.object({
              invite: z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                created_at: z.string(),
                global_role: z.string().nullable(),
                teams: z.array(z.any()),
              }),
            }),
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/invites/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/invites/{id}',
    summary: 'Update invite',
    description: 'Updates a pending invite.',
    tags: ['Invites'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Invite ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional().openapi({ description: 'Invited user name' }),
              email: z.string().email().optional().openapi({ description: 'Invited user email' }),
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
        description: 'Invite updated successfully',
      },
    },
  });
}
