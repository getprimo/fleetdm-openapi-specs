import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerIntegrationsRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/apns
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/apns',
    summary: 'Get APNs certificate info',
    description: 'Returns Apple Push Notification service (APNs) certificate information.',
    tags: ['Integrations'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'APNs info retrieved',
        content: {
          'application/json': {
            schema: z.object({
              common_name: z.string(),
              serial_number: z.string(),
              not_valid_before: z.string().datetime(),
              not_valid_after: z.string().datetime(),
              renew_date: z.string().datetime(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/abm_tokens
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/abm_tokens',
    summary: 'Get ABM tokens',
    description: 'Returns Apple Business Manager (ABM) token information.',
    tags: ['Integrations'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'ABM tokens retrieved',
        content: {
          'application/json': {
            schema: z.object({
              abm_tokens: z.array(z.object({
                id: z.number().int(),
                apple_id: z.string(),
                org_name: z.string(),
                mdm_server_token: z.string(),
                renew_at: z.string().datetime(),
                terms_expired: z.boolean(),
                teams: z.array(z.any()).optional(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/vpp_tokens
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/vpp_tokens',
    summary: 'Get VPP tokens',
    description: 'Returns Volume Purchase Program (VPP) token information.',
    tags: ['Integrations'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'VPP tokens retrieved',
        content: {
          'application/json': {
            schema: z.object({
              vpp_tokens: z.array(z.object({
                id: z.number().int(),
                org_name: z.string(),
                location: z.string(),
                renew_at: z.string().datetime(),
                teams: z.array(z.any()).optional(),
              })),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/scim/details
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/scim/details',
    summary: 'Get SCIM details',
    description: 'Returns SCIM integration details.',
    tags: ['Integrations'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'SCIM details retrieved',
        content: {
          'application/json': {
            schema: z.object({
              scim_url: z.string(),
              scim_token_expiration: z.string().datetime().optional(),
            }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/android_enterprise
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/android_enterprise',
    summary: 'Get Android Enterprise info',
    description: 'Returns Android Enterprise integration information.',
    tags: ['Integrations'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Android Enterprise info retrieved',
        content: {
          'application/json': {
            schema: z.object({
              enterprise_id: z.string().optional(),
              signup_url: z.string().optional(),
            }),
          },
        },
      },
    },
  });
}
