import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  CreatePolicyRequestSchema,
  UpdatePolicyRequestSchema,
  ListPoliciesResponseSchema,
  GetPolicyResponseSchema,
  DeletePoliciesRequestSchema,
  DeletePoliciesResponseSchema,
  PolicyCountResponseSchema,
  ResetAutomationRequestSchema,
} from '../schemas/policies';

export function registerPoliciesRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/global/policies
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/global/policies',
    summary: 'List global policies',
    description: 'Returns a list of all global policies.',
    tags: ['Policies'],
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
        description: 'Successfully retrieved global policies',
        content: {
          'application/json': {
            schema: ListPoliciesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/teams/:id/policies
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/teams/{id}/policies',
    summary: 'List team policies',
    description: 'Returns a list of all policies for a team.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        merge_inherited: z.coerce.boolean().optional().openapi({ description: 'Include inherited global policies' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved team policies',
        content: {
          'application/json': {
            schema: ListPoliciesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/policies/count
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/policies/count',
    summary: 'Count global policies',
    description: 'Returns the count of global policies.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved policy count',
        content: {
          'application/json': {
            schema: PolicyCountResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/team/:team_id/policies/count
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/team/{team_id}/policies/count',
    summary: 'Count team policies',
    description: 'Returns the count of policies for a team.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved policy count',
        content: {
          'application/json': {
            schema: PolicyCountResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/global/policies/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/global/policies/{id}',
    summary: 'Get global policy',
    description: 'Returns a specific global policy.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Policy ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved policy',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/teams/:team_id/policies/:policy_id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/teams/{team_id}/policies/{policy_id}',
    summary: 'Get team policy',
    description: 'Returns a specific team policy.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID' }),
        policy_id: z.coerce.number().int().openapi({ description: 'Policy ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved policy',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/global/policies
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/global/policies',
    summary: 'Create global policy',
    description: 'Creates a new global policy.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreatePolicyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy created successfully',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/teams/:id/policies
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/teams/{id}/policies',
    summary: 'Create team policy',
    description: 'Creates a new policy for a team.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: CreatePolicyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy created successfully',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/global/policies/delete
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/global/policies/delete',
    summary: 'Delete global policies',
    description: 'Deletes multiple global policies.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: DeletePoliciesRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policies deleted successfully',
        content: {
          'application/json': {
            schema: DeletePoliciesResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/teams/:team_id/policies/delete
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/teams/{team_id}/policies/delete',
    summary: 'Delete team policies',
    description: 'Deletes multiple team policies.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: DeletePoliciesRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policies deleted successfully',
        content: {
          'application/json': {
            schema: DeletePoliciesResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/global/policies/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/global/policies/{id}',
    summary: 'Update global policy',
    description: 'Updates an existing global policy.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Policy ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdatePolicyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy updated successfully',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/teams/:team_id/policies/:policy_id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/teams/{team_id}/policies/{policy_id}',
    summary: 'Update team policy',
    description: 'Updates an existing team policy.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID' }),
        policy_id: z.coerce.number().int().openapi({ description: 'Policy ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdatePolicyRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy updated successfully',
        content: {
          'application/json': {
            schema: GetPolicyResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/automations/reset
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/automations/reset',
    summary: 'Reset policy automations',
    description: 'Resets policy automation status for webhook/integration notifications.',
    tags: ['Policies'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ResetAutomationRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Automations reset successfully',
      },
    },
  });
}
