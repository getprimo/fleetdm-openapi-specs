import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  ListHostsQuerySchema,
  ListHostsResponseSchema,
  HostCountResponseSchema,
  HostSummaryResponseSchema,
  GetHostResponseSchema,
  TransferHostsRequestSchema,
  TransferHostsByFilterRequestSchema,
  DeleteHostsRequestSchema,
  DeviceMappingRequestSchema,
  HostHealthResponseSchema,
  HostMDMResponseSchema,
  HostEncryptionKeyResponseSchema,
  HostActivitiesResponseSchema,
  HostQueryRequestSchema,
  HostLabelsRequestSchema,
} from '../schemas/hosts';

export function registerHostsRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/hosts
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts',
    summary: 'List hosts',
    description: 'Returns a list of all hosts in Fleet.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: ListHostsQuerySchema,
    },
    responses: {
      200: {
        description: 'Successfully retrieved hosts',
        content: {
          'application/json': {
            schema: ListHostsResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/count
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/count',
    summary: 'Count hosts',
    description: 'Returns the count of hosts matching the filter criteria.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: ListHostsQuerySchema,
    },
    responses: {
      200: {
        description: 'Successfully retrieved host count',
        content: {
          'application/json': {
            schema: HostCountResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/host_summary
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/host_summary',
    summary: 'Get host summary',
    description: 'Returns a summary of host counts by status and platform.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        platform: z.string().optional().openapi({ description: 'Platform filter' }),
        low_disk_space: z.coerce.number().int().optional().openapi({ description: 'Low disk space threshold in GB' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host summary',
        content: {
          'application/json': {
            schema: HostSummaryResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}',
    summary: 'Get host',
    description: 'Returns a specific host by ID.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      query: z.object({
        exclude_software: z.coerce.boolean().optional().openapi({ description: 'Exclude software' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host',
        content: {
          'application/json': {
            schema: GetHostResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/identifier/:identifier
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/identifier/{identifier}',
    summary: 'Get host by identifier',
    description: 'Returns a host by its UUID, osquery host ID, hostname, or node key.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        identifier: z.string().openapi({ description: 'Host identifier (UUID, osquery host ID, hostname, or node key)' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host',
        content: {
          'application/json': {
            schema: GetHostResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/device/:token
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/device/{token}',
    summary: 'Get device by token',
    description: 'Returns a host using the device token. Useful for device-side authentication.',
    tags: ['Hosts'],
    request: {
      params: z.object({
        token: z.string().openapi({ description: 'Device token' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved device',
        content: {
          'application/json': {
            schema: GetHostResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/hosts/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/hosts/{id}',
    summary: 'Delete host',
    description: 'Deletes a host from Fleet.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Host deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/refetch
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/refetch',
    summary: 'Refetch host',
    description: 'Instructs Fleet to refetch a host\'s data.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Refetch requested successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/transfer
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/transfer',
    summary: 'Transfer hosts to a team',
    description: 'Transfers specific hosts to a team (or no team).',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: TransferHostsRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Hosts transferred successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/transfer/filter
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/transfer/filter',
    summary: 'Transfer hosts by filter',
    description: 'Transfers hosts matching the filter criteria to a team.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: TransferHostsByFilterRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Hosts transferred successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/hosts/:id/mdm
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/hosts/{id}/mdm',
    summary: 'Turn off MDM for host',
    description: 'Turns off MDM for a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'MDM turned off successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/delete
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/delete',
    summary: 'Bulk delete hosts',
    description: 'Deletes multiple hosts by ID or filter.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: DeleteHostsRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Hosts deleted successfully',
      },
    },
  });

  // PUT /api/v1/fleet/hosts/:id/device_mapping
  registry.registerPath({
    method: 'put',
    path: '/api/v1/fleet/hosts/{id}/device_mapping',
    summary: 'Update device mapping',
    description: 'Updates the device mapping (email) for a host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: DeviceMappingRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Device mapping updated successfully',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/health
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/health',
    summary: 'Get host health',
    description: 'Returns health metrics for a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host health',
        content: {
          'application/json': {
            schema: HostHealthResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/mdm
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/mdm',
    summary: 'Get host MDM info',
    description: 'Returns MDM information for a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host MDM info',
        content: {
          'application/json': {
            schema: HostMDMResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/summary/mdm
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/summary/mdm',
    summary: 'Get MDM summary',
    description: 'Returns MDM enrollment summary for hosts.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
        platform: z.string().optional().openapi({ description: 'Platform filter (darwin, windows)' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved MDM summary',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/macadmins
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/macadmins',
    summary: 'Get host macadmins data',
    description: 'Returns Munki and MDM data for a macOS host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved macadmins data',
      },
    },
  });

  // GET /api/v1/fleet/macadmins
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/macadmins',
    summary: 'Get aggregate macadmins data',
    description: 'Returns aggregate Munki and MDM data for all macOS hosts.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved macadmins data',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/software
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/software',
    summary: 'Get host software',
    description: 'Returns software installed on a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      query: z.object({
        page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
        per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
        query: z.string().optional().openapi({ description: 'Search query' }),
        order_key: z.string().optional().openapi({ description: 'Column to order by' }),
        order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
        vulnerable: z.coerce.boolean().optional().openapi({ description: 'Filter to only vulnerable software' }),
        available_for_install: z.coerce.boolean().optional().openapi({ description: 'Filter to software available for install' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved host software',
      },
    },
  });

  // GET /api/v1/fleet/hosts/report
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/report',
    summary: 'Get hosts report',
    description: 'Returns a report of hosts matching the filter criteria.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      query: z.object({
        format: z.enum(['csv', 'json']).optional().openapi({ description: 'Report format' }),
        columns: z.string().optional().openapi({ description: 'Comma-separated list of columns' }),
        label_id: z.coerce.number().int().optional(),
        team_id: z.coerce.number().int().optional(),
        software_id: z.coerce.number().int().optional(),
        software_version_id: z.coerce.number().int().optional(),
        software_title_id: z.coerce.number().int().optional(),
        policy_id: z.coerce.number().int().optional(),
        vulnerability: z.string().optional(),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved hosts report',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/encryption_key
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/encryption_key',
    summary: 'Get host encryption key',
    description: 'Returns the disk encryption key for a host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved encryption key',
        content: {
          'application/json': {
            schema: HostEncryptionKeyResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/certificates
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/certificates',
    summary: 'Get host certificates',
    description: 'Returns certificates installed on a host.',
    tags: ['Hosts'],
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
        description: 'Successfully retrieved host certificates',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/configuration_profiles
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/configuration_profiles',
    summary: 'Get host configuration profiles',
    description: 'Returns configuration profiles for a host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved configuration profiles',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/lock
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/lock',
    summary: 'Lock host',
    description: 'Locks a host via MDM.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      query: z.object({
        view_pin: z.coerce.boolean().optional().openapi({ description: 'Return the unlock PIN in response' }),
      }),
    },
    responses: {
      200: {
        description: 'Lock command sent successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/unlock
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/unlock',
    summary: 'Unlock host',
    description: 'Unlocks a host via MDM.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Unlock command sent successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/wipe
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/wipe',
    summary: 'Wipe host',
    description: 'Wipes a host via MDM.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Wipe command sent successfully',
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/activities
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/activities',
    summary: 'Get host activities',
    description: 'Returns past activities for a specific host.',
    tags: ['Hosts'],
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
        description: 'Successfully retrieved host activities',
        content: {
          'application/json': {
            schema: HostActivitiesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/hosts/:id/activities/upcoming
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/hosts/{id}/activities/upcoming',
    summary: 'Get host upcoming activities',
    description: 'Returns upcoming activities for a specific host.',
    tags: ['Hosts'],
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
        description: 'Successfully retrieved upcoming activities',
      },
    },
  });

  // DELETE /api/v1/fleet/hosts/:id/activities/upcoming/:activity_id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/hosts/{id}/activities/upcoming/{activity_id}',
    summary: 'Cancel upcoming activity',
    description: 'Cancels a pending/upcoming activity for a host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
        activity_id: z.string().openapi({ description: 'Activity UUID' }),
      }),
    },
    responses: {
      200: {
        description: 'Activity cancelled successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/labels
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/labels',
    summary: 'Add labels to host',
    description: 'Adds labels to a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: HostLabelsRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Labels added successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/hosts/:id/labels
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/hosts/{id}/labels',
    summary: 'Remove labels from host',
    description: 'Removes labels from a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: HostLabelsRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Labels removed successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/:id/query
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/{id}/query',
    summary: 'Run live query on host',
    description: 'Runs a live query on a specific host.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Host ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: HostQueryRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Query executed successfully',
      },
    },
  });

  // POST /api/v1/fleet/hosts/identifier/:identifier/query
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/hosts/identifier/{identifier}/query',
    summary: 'Run live query on host by identifier',
    description: 'Runs a live query on a host identified by UUID, hostname, etc.',
    tags: ['Hosts'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        identifier: z.string().openapi({ description: 'Host identifier' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: HostQueryRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Query executed successfully',
      },
    },
  });
}
