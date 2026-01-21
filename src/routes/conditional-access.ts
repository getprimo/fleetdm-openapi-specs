import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerConditionalAccessRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/conditional_access/idp/signing_cert
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/conditional_access/idp/signing_cert',
    summary: 'Get IdP signing certificate',
    description: 'Returns the IdP signing certificate for conditional access.',
    tags: ['Conditional Access'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved signing certificate',
        content: {
          'application/x-pem-file': {
            schema: z.string().openapi({ description: 'PEM-encoded certificate' }),
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/conditional_access/idp/apple/profile
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/conditional_access/idp/apple/profile',
    summary: 'Get Apple conditional access profile',
    description: 'Returns the Apple configuration profile for conditional access.',
    tags: ['Conditional Access'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved Apple profile',
        content: {
          'application/x-apple-aspen-config': {
            schema: z.string().openapi({ description: 'Apple configuration profile' }),
          },
        },
      },
    },
  });

  // DELETE /api/v1/conditional-access/microsoft
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/conditional-access/microsoft',
    summary: 'Delete Microsoft conditional access',
    description: 'Deletes the Microsoft Entra conditional access configuration.',
    tags: ['Conditional Access'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Microsoft conditional access deleted successfully',
      },
    },
  });
}
