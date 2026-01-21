import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  ConfigResponseSchema,
  UpdateConfigRequestSchema,
  UpdateConfigQuerySchema,
  CertificateResponseSchema,
  EnrollSecretSpecResponseSchema,
  ApplyEnrollSecretSpecRequestSchema,
  TeamSecretsResponseSchema,
  ModifyTeamSecretsRequestSchema,
  VersionResponseSchema,
} from '../schemas/config';

export function registerConfigRoutes(registry: OpenAPIRegistry) {
  // GET /api/v1/fleet/config/certificate
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/config/certificate',
    summary: 'Get certificate chain',
    description: 'Returns the Fleet certificate chain.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved certificate chain',
        content: {
          'application/json': {
            schema: CertificateResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/config
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/config',
    summary: 'Get configuration',
    description: `Returns all information about the Fleet's configuration.

The \`agent_options\`, \`sso_settings\` and \`smtp_settings\` fields are only returned for admin and GitOps users with global access.`,
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved configuration',
        content: {
          'application/json': {
            schema: ConfigResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/config
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/config',
    summary: 'Update configuration',
    description: 'Modifies the Fleet\'s configuration with the supplied information.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    request: {
      query: UpdateConfigQuerySchema,
      body: {
        content: {
          'application/json': {
            schema: UpdateConfigRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Configuration updated successfully',
        content: {
          'application/json': {
            schema: ConfigResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/spec/enroll_secret
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/spec/enroll_secret',
    summary: 'Get enroll secrets for global scope',
    description: 'Returns the valid global enroll secrets.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved enroll secrets',
        content: {
          'application/json': {
            schema: EnrollSecretSpecResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/spec/enroll_secret
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/spec/enroll_secret',
    summary: 'Apply enroll secrets for global scope',
    description: 'Replaces all existing global enroll secrets with the provided secrets.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ApplyEnrollSecretSpecRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Enroll secrets applied successfully',
      },
    },
  });

  // GET /api/v1/fleet/teams/:id/secrets
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/teams/{id}/secrets',
    summary: 'Get team enroll secrets',
    description: 'Returns the valid enroll secrets for a team.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
    },
    responses: {
      200: {
        description: 'Successfully retrieved team secrets',
        content: {
          'application/json': {
            schema: TeamSecretsResponseSchema,
          },
        },
      },
    },
  });

  // PATCH /api/v1/fleet/teams/:id/secrets
  registry.registerPath({
    method: 'patch',
    path: '/api/v1/fleet/teams/{id}/secrets',
    summary: 'Modify team enroll secrets',
    description: 'Replaces all existing enroll secrets for a team with the provided secrets.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({ description: 'Team ID' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: ModifyTeamSecretsRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Team secrets modified successfully',
        content: {
          'application/json': {
            schema: TeamSecretsResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/version
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/version',
    summary: 'Get version',
    description: 'Returns the Fleet server version information.',
    tags: ['Fleet Configuration'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved version',
        content: {
          'application/json': {
            schema: VersionResponseSchema,
          },
        },
      },
    },
  });
}
