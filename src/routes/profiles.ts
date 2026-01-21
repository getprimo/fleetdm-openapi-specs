import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerProfilesRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/configuration_profiles
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/configuration_profiles',
    summary: 'Add custom OS setting (configuration profile)',
    description: `Adds a custom configuration profile for macOS or Windows.

Accepts .mobileconfig (macOS) or .xml (Windows) files.`,
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID (omit for no team)' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              profile: z.any().openapi({ description: 'The profile file (.mobileconfig or .xml)' }),
              labels: z.string().optional().openapi({ description: 'Comma-separated list of label names' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Profile added successfully',
        content: {
          'application/json': {
            schema: z.object({
              profile_uuid: z.string().openapi({ description: 'UUID of the created profile' }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/configuration_profiles
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/configuration_profiles',
    summary: 'List custom OS settings (configuration profiles)',
    description: 'Returns a list of custom configuration profiles.',
    tags: ['OS Settings'],
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
        description: 'Successfully retrieved profiles',
        content: {
          'application/json': {
            schema: z.object({
              profiles: z.array(z.object({
                profile_uuid: z.string(),
                team_id: z.number().int().nullable(),
                name: z.string(),
                platform: z.string(),
                identifier: z.string(),
                created_at: z.string().datetime(),
                updated_at: z.string().datetime(),
                labels: z.array(z.object({
                  name: z.string(),
                  broken: z.boolean(),
                })).optional(),
              })),
              meta: z.object({
                has_next_results: z.boolean(),
                has_previous_results: z.boolean(),
              }),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/configuration_profiles/:profile_uuid
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/configuration_profiles/{profile_uuid}',
    summary: 'Download custom OS setting (configuration profile)',
    description: 'Downloads a configuration profile. Use ?alt=media to download the raw file.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
      }),
      query: z.object({
        alt: z.enum(['media']).optional().openapi({ description: 'Set to media to download the raw file' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile retrieved successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/configuration_profiles/:profile_uuid
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/configuration_profiles/{profile_uuid}',
    summary: 'Delete custom OS setting (configuration profile)',
    description: 'Deletes a custom configuration profile.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/configuration_profiles/:profile_uuid/resend
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/configuration_profiles/{profile_uuid}/resend',
    summary: 'Resend configuration profile to host',
    description: 'Resends a configuration profile to a specific host.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
        profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile resend initiated successfully',
      },
    },
  });

  // POST /api/v1/fleet/configuration_profiles/batch
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/configuration_profiles/batch',
    summary: 'Batch apply custom OS settings',
    description: 'Applies multiple configuration profiles at once.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
        dry_run: z.coerce.boolean().optional().openapi({ description: 'Validate without applying' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              profiles: z.any().openapi({ description: 'Profile files' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Profiles applied successfully',
      },
    },
  });

  // POST /api/v1/fleet/device/:token/configuration_profiles/:profile_uuid/resend
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/device/{token}/configuration_profiles/{profile_uuid}/resend',
    summary: 'Resend configuration profile via device token',
    description: 'Resends a configuration profile to a device using its token.',
    tags: ['OS Settings'],
    request: {
      params: z.object({
        token: z.string().openapi({ description: 'Device token' }),
        profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile resend initiated successfully',
      },
    },
  });

  // POST /api/v1/fleet/configuration_profiles/resend/batch
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/configuration_profiles/resend/batch',
    summary: 'Batch resend configuration profiles',
    description: 'Resends configuration profiles to multiple hosts.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
              host_ids: z.array(z.number().int()).optional().openapi({ description: 'Host IDs' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Profiles resend initiated successfully',
      },
    },
  });

  // POST /api/v1/fleet/disk_encryption
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/disk_encryption',
    summary: 'Update disk encryption enforcement',
    description: 'Updates disk encryption enforcement settings.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              enable_disk_encryption: z.boolean().openapi({ description: 'Whether to enable disk encryption' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Disk encryption settings updated',
      },
    },
  });

  // GET /api/v1/fleet/disk_encryption
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/disk_encryption',
    summary: 'Get disk encryption',
    description: 'Gets disk encryption enforcement status.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Disk encryption settings retrieved',
      },
    },
  });

  // GET /api/v1/fleet/configuration_profiles/summary
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/configuration_profiles/summary',
    summary: 'Get OS settings status',
    description: 'Returns summary statistics for configuration profile deployment.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile summary retrieved',
        content: {
          'application/json': {
            schema: z.object({
              verified: z.number().int(),
              verifying: z.number().int(),
              pending: z.number().int(),
              failed: z.number().int(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/configuration_profile/:profile_uuid/status
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/configuration_profile/{profile_uuid}/status',
    summary: 'Get profile status',
    description: 'Returns deployment status for a specific profile.',
    tags: ['OS Settings'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        profile_uuid: z.string().openapi({ description: 'Profile UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Profile status retrieved',
      },
    },
  });
}
