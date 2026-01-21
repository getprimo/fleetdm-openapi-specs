import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  CreateCertificateAuthorityRequestSchema,
  CreateCertificateAuthorityResponseSchema,
  UploadCertificateRequestSchema,
  UploadCertificateResponseSchema,
  UpdateCertificateAuthorityRequestSchema,
  ListCertificateAuthoritiesResponseSchema,
  GetCertificateAuthorityResponseSchema,
  ListCertificatesResponseSchema,
  GetCertificateResponseSchema,
  RequestCertificateRequestSchema,
  RequestCertificateResponseSchema,
} from '../schemas/certificates';

export function registerCertificatesRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/certificate_authorities
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/certificate_authorities',
    summary: 'Create certificate authority',
    description: 'Creates a new certificate authority.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateCertificateAuthorityRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certificate authority created successfully',
        content: {
          'application/json': {
            schema: CreateCertificateAuthorityResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/certificates
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/certificates',
    summary: 'Upload certificate',
    description: 'Uploads a new certificate.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UploadCertificateRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certificate uploaded successfully',
        content: {
          'application/json': {
            schema: UploadCertificateResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/certificate_authorities/:id
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/certificate_authorities/{id}',
    summary: 'Update certificate authority',
    description: 'Updates an existing certificate authority.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate authority ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateCertificateAuthorityRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certificate authority updated successfully',
        content: {
          'application/json': {
            schema: GetCertificateAuthorityResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/certificate_authorities
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/certificate_authorities',
    summary: 'List certificate authorities',
    description: 'Returns a list of all certificate authorities.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved certificate authorities',
        content: {
          'application/json': {
            schema: ListCertificateAuthoritiesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/certificate_authorities/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/certificate_authorities/{id}',
    summary: 'Get certificate authority',
    description: 'Returns a specific certificate authority.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate authority ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved certificate authority',
        content: {
          'application/json': {
            schema: GetCertificateAuthorityResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/certificates
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/certificates',
    summary: 'List certificates',
    description: 'Returns a list of all certificates.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved certificates',
        content: {
          'application/json': {
            schema: ListCertificatesResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/certificates/:id
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/certificates/{id}',
    summary: 'Get certificate',
    description: 'Returns a specific certificate.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved certificate',
        content: {
          'application/json': {
            schema: GetCertificateResponseSchema,
          },
        },
      },
    },
  });

  // DELETE /api/v1/fleet/certificate_authorities/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/certificate_authorities/{id}',
    summary: 'Delete certificate authority',
    description: 'Deletes a certificate authority.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate authority ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Certificate authority deleted successfully',
      },
    },
  });

  // DELETE /api/v1/fleet/certificates/:id
  registry.registerPath({
    method: 'delete',
    path: '/api/v1/fleet/certificates/{id}',
    summary: 'Delete certificate',
    description: 'Deletes a certificate.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Certificate deleted successfully',
      },
    },
  });

  // POST /api/v1/fleet/certificate_authorities/:id/request_certificate
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/certificate_authorities/{id}/request_certificate',
    summary: 'Request certificate',
    description: 'Requests a new certificate from a certificate authority.',
    tags: ['Certificates'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Certificate authority ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: RequestCertificateRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certificate requested successfully',
        content: {
          'application/json': {
            schema: RequestCertificateResponseSchema,
          },
        },
      },
    },
  });
}
