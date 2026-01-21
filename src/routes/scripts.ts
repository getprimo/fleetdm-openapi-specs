import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerScriptsRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/scripts/run
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/scripts/run',
    summary: 'Run script on host',
    description: 'Runs a script on a specific host.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              host_id: z.number().int().openapi({ description: 'Host ID' }),
              script_id: z.number().int().optional().openapi({ description: 'Script ID (saved script)' }),
              script_contents: z.string().optional().openapi({ description: 'Script contents (ad-hoc script)' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Script execution started',
        content: {
          'application/json': {
            schema: z.object({
              host_id: z.number().int(),
              execution_id: z.string(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/scripts/results/:execution_id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts/results/{execution_id}',
    summary: 'Get script results',
    description: 'Returns the results of a script execution.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        execution_id: z.string().openapi({ description: 'Script execution ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Script results retrieved',
        content: {
          'application/json': {
            schema: z.object({
              host_id: z.number().int(),
              execution_id: z.string(),
              script_id: z.number().int().optional(),
              script_contents: z.string(),
              exit_code: z.number().int().nullable(),
              output: z.string(),
              message: z.string(),
              runtime: z.number().int(),
              host_timeout: z.boolean(),
            }),
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/scripts/run/batch
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/scripts/run/batch',
    summary: 'Run script on multiple hosts',
    description: 'Runs a script on multiple hosts.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              script_id: z.number().int().openapi({ description: 'Script ID' }),
              host_ids: z.array(z.number().int()).optional().openapi({ description: 'Host IDs to target' }),
              label_ids: z.array(z.number().int()).optional().openapi({ description: 'Label IDs to target' }),
              team_id: z.number().int().optional().openapi({ description: 'Team ID to target' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Batch script execution started',
        content: {
          'application/json': {
            schema: z.object({
              batch_execution_id: z.string(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/scripts/batch
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts/batch',
    summary: 'List batch script executions',
    description: 'Returns a list of batch script executions.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
      }),
    },
    responses: {
      200: {
        description: 'Batch executions list retrieved',
      },
    },
  });

  // GET /api/v1/fleet/scripts/batch/:batch_execution_id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts/batch/{batch_execution_id}',
    summary: 'Get batch script execution',
    description: 'Returns details about a batch script execution.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        batch_execution_id: z.string().openapi({ description: 'Batch execution ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Batch execution details retrieved',
      },
    },
  });

  // GET /api/v1/fleet/scripts/batch/:batch_execution_id/host-results
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts/batch/{batch_execution_id}/host-results',
    summary: 'Get batch script host results',
    description: 'Returns host-level results for a batch script execution.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        batch_execution_id: z.string().openapi({ description: 'Batch execution ID' }),
      }),
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        status: z.enum(['ran', 'pending', 'error']).optional().openapi({ description: 'Status filter' }),
      }),
    },
    responses: {
      200: {
        description: 'Host results retrieved',
      },
    },
  });

  // POST /api/v1/fleet/scripts
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/scripts',
    summary: 'Upload script',
    description: 'Uploads a new saved script.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              script: z.any().openapi({ description: 'Script file' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Script uploaded successfully',
        content: {
          'application/json': {
            schema: z.object({
              script_id: z.number().int(),
            }),
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/scripts/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/scripts/{id}',
    summary: 'Update script',
    description: 'Updates an existing script.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Script ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              script: z.any().openapi({ description: 'Script file' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Script updated successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/scripts/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/scripts/{id}',
    summary: 'Delete script',
    description: 'Deletes a saved script.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Script ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Script deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/scripts
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts',
    summary: 'List scripts',
    description: 'Returns a list of saved scripts.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
      }),
    },
    responses: {
      200: {
        description: 'Scripts list retrieved',
        content: {
          'application/json': {
            schema: z.object({
              scripts: z.array(z.object({
                id: z.number().int(),
                team_id: z.number().int().nullable(),
                name: z.string(),
                created_at: z.string().datetime(),
                updated_at: z.string().datetime(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/scripts
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/scripts',
    summary: 'Get host script executions',
    description: 'Returns script execution history for a host.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      query: z.object({
        page: z.coerce.number().int().optional(),
        per_page: z.coerce.number().int().optional(),
      }),
    },
    responses: {
      200: {
        description: 'Host script executions retrieved',
      },
    },
  });

  // GET /api/v1/fleet/scripts/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scripts/{id}',
    summary: 'Get script',
    description: 'Returns a script. Use ?alt=media to download the raw script content.',
    tags: ['Scripts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Script ID' }),
      }),
      query: z.object({
        alt: z.enum(['media']).optional().openapi({ description: 'Set to media to download raw script' }),
      }),
    },
    responses: {
      200: {
        description: 'Script retrieved',
      },
    },
  });
}
