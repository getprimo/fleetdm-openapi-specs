import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  CreateFleetMaintainedAppRequestSchema,
  CreateFleetMaintainedAppResponseSchema,
  FleetSoftwarePackageSchema,
  FleetSoftwarePlatformSchema
} from '../schemas/software';

export function registerSoftwareRoutes(registry: OpenAPIRegistry) {
  // Register reusable components
  registry.register('FleetSoftwarePlatform', FleetSoftwarePlatformSchema);
  registry.register('FleetSoftwarePackage', FleetSoftwarePackageSchema);

  // GET /api/v1/fleet/software/titles
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/titles',
    summary: 'List software titles',
    description: 'Returns a list of software titles.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        vulnerable: z.coerce.boolean().optional().openapi({ description: 'Filter to only vulnerable software' }),
        available_for_install: z.coerce.boolean().optional().openapi({ description: 'Filter to software available for install' }),
        self_service: z.coerce.boolean().optional().openapi({ description: 'Filter to self-service software' }),
        platform: FleetSoftwarePlatformSchema.optional().openapi({ description: 'Platform filter (comma-separated)' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved software titles',
        content: {
          'application/json': {
            schema: z.object({
              software_titles: z.array(z.object({
                id: z.number().int(),
                name: z.string(),
                software_package: FleetSoftwarePackageSchema.nullable(),
                app_store_app: z.any().nullable(),
                versions_count: z.number().int(),
                source: z.string(),
                hosts_count: z.number().int(),
                versions: z.array(z.any()).optional(),
                browser: z.string().optional(),
              })),
              count: z.number().int(),
              counts_updated_at: z.string().datetime().nullable(),
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

  // GET /api/v1/fleet/software/versions
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/versions',
    summary: 'List software versions',
    description: 'Returns a list of software versions.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        vulnerable: z.coerce.boolean().optional().openapi({ description: 'Filter to only vulnerable software' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved software versions',
      },
    },
  });

  // GET /api/v1/fleet/os_versions
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/os_versions',
    summary: 'List OS versions',
    description: 'Returns a list of operating system versions.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        platform: FleetSoftwarePlatformSchema.optional().openapi({ description: 'Platform filter' }),
        os_name: z.string().optional().openapi({ description: 'OS name filter' }),
        os_version: z.string().optional().openapi({ description: 'OS version filter' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved OS versions',
      },
    },
  });

  // GET /api/v1/fleet/software/titles/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/titles/{id}',
    summary: 'Get software title',
    description: 'Returns a specific software title.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved software title',
      },
    },
  });

  // GET /api/v1/fleet/software/versions/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/versions/{id}',
    summary: 'Get software version',
    description: 'Returns a specific software version.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software version ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved software version',
      },
    },
  });

  // GET /api/v1/fleet/os_versions/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/os_versions/{id}',
    summary: 'Get OS version',
    description: 'Returns a specific OS version.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'OS version ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved OS version',
      },
    },
  });

  // POST /api/v1/fleet/software/package
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/software/package',
    summary: 'Upload software package',
    description: 'Uploads a software package to Fleet.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              software: z.any().openapi({ description: 'Software package file' }),
              install_script: z.string().optional().openapi({ description: 'Install script' }),
              pre_install_query: z.string().optional().openapi({ description: 'Pre-install query' }),
              post_install_script: z.string().optional().openapi({ description: 'Post-install script' }),
              uninstall_script: z.string().optional().openapi({ description: 'Uninstall script' }),
              self_service: z.coerce.boolean().optional().openapi({ description: 'Enable self-service' }),
              labels_include_any: z.string().optional().openapi({ description: 'Labels to include (comma-separated)' }),
              labels_exclude_any: z.string().optional().openapi({ description: 'Labels to exclude (comma-separated)' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Software package uploaded successfully',
        content: {
          'application/json': {
            schema: z.object({
              software_title_id: z.number().int(),
            }),
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/software/titles/:id/package
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/software/titles/{id}/package',
    summary: 'Update software package',
    description: 'Updates an existing software package.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              software: z.any().optional().openapi({ description: 'Software package file' }),
              install_script: z.string().optional().openapi({ description: 'Install script' }),
              pre_install_query: z.string().optional().openapi({ description: 'Pre-install query' }),
              post_install_script: z.string().optional().openapi({ description: 'Post-install script' }),
              uninstall_script: z.string().optional().openapi({ description: 'Uninstall script' }),
              self_service: z.coerce.boolean().optional().openapi({ description: 'Enable self-service' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Software package updated successfully',
      },
    },
  });

  // PUT /api/v1/fleet/software/titles/:id/icon
  registry.registerPath({
    method: 'put',
    path: '/api/v1/fleet/software/titles/{id}/icon',
    summary: 'Upload software icon',
    description: 'Uploads an icon for a software title.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              icon: z.any().openapi({ description: 'Icon image file' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Icon uploaded successfully',
      },
    },
  });

  // GET /api/v1/fleet/software/titles/:id/icon
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/titles/{id}/icon',
    summary: 'Get software icon',
    description: 'Returns the icon for a software title.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Icon retrieved',
        content: {
          'image/png': {
            schema: z.string(),
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/software/titles/:id/icon
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/software/titles/{id}/icon',
    summary: 'Delete software icon',
    description: 'Deletes the icon for a software title.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Icon deleted successfully',
      },
    },
  });

  // GET /api/v1/fleet/software/app_store_apps
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/app_store_apps',
    summary: 'List App Store apps',
    description: 'Returns a list of available App Store apps.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved App Store apps',
      },
    },
  });

  // POST /api/v1/fleet/software/app_store_apps
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/software/app_store_apps',
    summary: 'Add App Store app',
    description: 'Adds an App Store app for deployment.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              app_store_id: z.string().openapi({ description: 'App Store app ID' }),
              team_id: z.number().int().openapi({ description: 'Team ID' }),
              self_service: z.boolean().optional().openapi({ description: 'Enable self-service' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'App Store app added successfully',
      },
    },
  });

  // PATCH /api/v1/fleet/software/titles/:title_id/app_store_app
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/software/titles/{title_id}/app_store_app',
    summary: 'Update App Store app',
    description: 'Updates an App Store app configuration.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        title_id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              self_service: z.boolean().optional().openapi({ description: 'Enable self-service' }),
              labels_include_any: z.array(z.string()).optional(),
              labels_exclude_any: z.array(z.string()).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'App Store app updated successfully',
      },
    },
  });

  // GET /api/v1/fleet/software/fleet_maintained_apps
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/fleet_maintained_apps',
    summary: 'List Fleet-maintained apps',
    description: 'Returns a list of available Fleet-maintained apps.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved Fleet-maintained apps',
      },
    },
  });

  // GET /api/v1/fleet/software/fleet_maintained_apps/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/fleet_maintained_apps/{id}',
    summary: 'Get Fleet-maintained app',
    description: 'Returns details about a specific Fleet-maintained app.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Fleet-maintained app ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved Fleet-maintained app',
      },
    },
  });

  // POST /api/v1/fleet/software/fleet_maintained_apps
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/software/fleet_maintained_apps',
    summary: 'Create Fleet-maintained app',
    description: `Add Fleet-maintained app so it's available for install.

**Experimental feature.** This feature is undergoing rapid improvement, which may result in breaking changes to the API or configuration surface. It is not recommended for use in automated workflows.

_Available in Fleet Premium._

Only one of \`labels_include_any\` or \`labels_exclude_any\` can be specified. If neither are specified, all hosts are targeted.`,
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateFleetMaintainedAppRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully created Fleet-maintained app',
        content: {
          'application/json': {
            schema: CreateFleetMaintainedAppResponseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
      },
      402: {
        description: 'Payment required - Fleet Premium license required',
      },
    },
  });

  // GET /api/v1/fleet/software/titles/:id/package?alt=media
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/titles/{id}/package',
    summary: 'Download software package',
    description: 'Downloads the software package. Use ?alt=media to get the binary.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
        alt: z.enum(['media']).optional().openapi({ description: 'Set to media to download the package' }),
      }),
    },
    responses: {
      200: {
        description: 'Package downloaded',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/software/:software_title_id/install
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/software/{software_title_id}/install',
    summary: 'Install software on host',
    description: 'Triggers software installation on a specific host.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
        software_title_id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Installation triggered',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/software/:software_title_id/uninstall
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/software/{software_title_id}/uninstall',
    summary: 'Uninstall software from host',
    description: 'Triggers software uninstallation on a specific host.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
        software_title_id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Uninstallation triggered',
      },
    },
  });

  // GET /api/v1/fleet/software/install/:install_uuid/results
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/software/install/{install_uuid}/results',
    summary: 'Get software install results',
    description: 'Returns the results of a software installation.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        install_uuid: z.string().openapi({ description: 'Install UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Install results retrieved',
      },
    },
  });

  // DELETE /api/v1/fleet/software/titles/:software_title_id/available_for_install
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/software/titles/{software_title_id}/available_for_install',
    summary: 'Remove software from install list',
    description: 'Removes a software title from the available for install list.',
    tags: ['Software'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        software_title_id: z.coerce.number().int().openapi({ description: 'Software title ID' }),
      }),
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Software removed from install list',
      },
    },
  });
}
