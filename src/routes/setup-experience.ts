import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerSetupExperienceRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/enrollment_profiles/automatic
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/enrollment_profiles/automatic',
    summary: 'Upload automatic enrollment profile',
    description: 'Uploads a custom automatic enrollment (DEP) profile for macOS hosts.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              profile: z.any().openapi({ description: 'The automatic enrollment profile file (.json)' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Profile uploaded successfully',
      },
    },
  });

  // GET /api/v1/fleet/enrollment_profiles/automatic
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/enrollment_profiles/automatic',
    summary: 'Get automatic enrollment profile',
    description: 'Returns the automatic enrollment profile metadata.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile metadata retrieved',
      },
    },
  });

  // DELETE /api/v1/fleet/enrollment_profiles/automatic
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/enrollment_profiles/automatic',
    summary: 'Delete automatic enrollment profile',
    description: 'Deletes the custom automatic enrollment profile.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/enrollment_profiles/ota
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/enrollment_profiles/ota',
    summary: 'Get OTA enrollment profile',
    description: 'Returns the OTA (over-the-air) enrollment profile for manual MDM enrollment.',
    tags: ['Setup Experience'],
    request: {
      query: z.object({
        enroll_secret: z.string().openapi({ description: 'Enroll secret' }),
      }),
    },
    responses: {
      200: {
        description: 'OTA profile retrieved',
        content: {
          'application/x-apple-aspen-config': {
            schema: z.string(),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/enrollment_profiles/manual
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/enrollment_profiles/manual',
    summary: 'Get manual enrollment profile',
    description: 'Returns the manual enrollment profile for MDM enrollment.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Manual enrollment profile retrieved',
        content: {
          'application/x-apple-aspen-config': {
            schema: z.string(),
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/bootstrap
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/bootstrap',
    summary: 'Upload bootstrap package',
    description: 'Uploads a bootstrap package for macOS hosts during DEP enrollment.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              package: z.any().openapi({ description: 'The bootstrap package (.pkg)' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Bootstrap package uploaded successfully',
      },
    },
  });

  // GET /api/v1/fleet/bootstrap/:team_id/metadata
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/bootstrap/{team_id}/metadata',
    summary: 'Get bootstrap package metadata',
    description: 'Returns metadata about the bootstrap package.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID (0 for no team)' }),
      }),
    },
    responses: {
      200: {
        description: 'Bootstrap package metadata retrieved',
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              team_id: z.number().int(),
              sha256: z.string(),
              token: z.string(),
              created_at: z.string().datetime(),
            }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/bootstrap/:team_id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/bootstrap/{team_id}',
    summary: 'Delete bootstrap package',
    description: 'Deletes the bootstrap package.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        team_id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Bootstrap package deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/bootstrap
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/bootstrap',
    summary: 'Download bootstrap package',
    description: 'Downloads the bootstrap package.',
    tags: ['Setup Experience'],
    request: {
      query: z.object({
        token: z.string().openapi({ description: 'Bootstrap package token' }),
      }),
    },
    responses: {
      200: {
        description: 'Bootstrap package downloaded',
        content: {
          'application/octet-stream': {
            schema: z.string(),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/bootstrap/summary
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/bootstrap/summary',
    summary: 'Get bootstrap package summary',
    description: 'Returns summary statistics for bootstrap package installation.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Bootstrap summary retrieved',
        content: {
          'application/json': {
            schema: z.object({
              installed: z.number().int(),
              pending: z.number().int(),
              failed: z.number().int(),
            }),
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/setup_experience
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/setup_experience',
    summary: 'Update setup experience',
    description: 'Updates setup experience settings.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              enable_release_device_manually: z.boolean().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Setup experience updated',
      },
    },
  });

  // POST /api/v1/fleet/setup_experience/eula
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/setup_experience/eula',
    summary: 'Upload EULA',
    description: 'Uploads a EULA (End User License Agreement) PDF.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              eula: z.any().openapi({ description: 'The EULA PDF file' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'EULA uploaded successfully',
      },
    },
  });

  // GET /api/v1/fleet/setup_experience/eula/metadata
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/setup_experience/eula/metadata',
    summary: 'Get EULA metadata',
    description: 'Returns metadata about the uploaded EULA.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'EULA metadata retrieved',
      },
    },
  });

  // DELETE /api/v1/fleet/setup_experience/eula/:token
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/setup_experience/eula/{token}',
    summary: 'Delete EULA',
    description: 'Deletes the uploaded EULA.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        token: z.string().openapi({ description: 'EULA token' }),
      }),
    },
    responses: {
      200: {
        description: 'EULA deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/setup_experience/eula/:token
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/setup_experience/eula/{token}',
    summary: 'Download EULA',
    description: 'Downloads the EULA PDF.',
    tags: ['Setup Experience'],
    request: {
      params: z.object({
        token: z.string().openapi({ description: 'EULA token' }),
      }),
    },
    responses: {
      200: {
        description: 'EULA downloaded',
        content: {
          'application/pdf': {
            schema: z.string(),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/setup_experience/software
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/setup_experience/software',
    summary: 'Get setup experience software',
    description: 'Returns software configured for the setup experience.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Setup experience software retrieved',
      },
    },
  });

  // PUT /api/v1/fleet/setup_experience/software
  registry.registerPath({
    method: 'put',
    path: '/api/v1/fleet/setup_experience/software',
    summary: 'Update setup experience software',
    description: 'Updates software configured for the setup experience.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              software_title_ids: z.array(z.number().int()).openapi({ description: 'Software title IDs' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Setup experience software updated',
      },
    },
  });

  // POST /api/v1/fleet/setup_experience/script
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/setup_experience/script',
    summary: 'Upload setup experience script',
    description: 'Uploads a script to run during setup experience.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              script: z.any().openapi({ description: 'The script file' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Script uploaded successfully',
      },
    },
  });

  // PUT /api/v1/fleet/setup_experience/script
  registry.registerPath({
    method: 'put',
    path: '/api/v1/fleet/setup_experience/script',
    summary: 'Update setup experience script',
    description: 'Updates the setup experience script.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              script: z.any().openapi({ description: 'The script file' }),
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

  // GET /api/v1/fleet/setup_experience/script
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/setup_experience/script',
    summary: 'Get setup experience script',
    description: 'Returns the setup experience script. Use ?alt=media to download.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
        alt: z.enum(['media']).optional().openapi({ description: 'Set to media to download the raw script' }),
      }),
    },
    responses: {
      200: {
        description: 'Script retrieved',
      },
    },
  });

  // DELETE /api/v1/fleet/setup_experience/script
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/setup_experience/script',
    summary: 'Delete setup experience script',
    description: 'Deletes the setup experience script.',
    tags: ['Setup Experience'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Script deleted successfully',
      },
    },
  });
}
