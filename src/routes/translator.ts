import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerTranslatorRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/translate
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/translate',
    summary: 'Translate identifiers',
    description: 'Translates identifiers between different formats (e.g., host name to host ID).',
    tags: ['Translator'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              list: z.array(z.object({
                type: z.string().openapi({ description: 'Payload type (e.g., host)' }),
                payload: z.object({
                  identifier: z.string().openapi({ description: 'Identifier to translate' }),
                }),
              })).openapi({ description: 'List of items to translate' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Translation successful',
        content: {
          'application/json': {
            schema: z.object({
              list: z.array(z.object({
                type: z.string(),
                payload: z.object({
                  identifier: z.string(),
                  id: z.number().int(),
                }),
              })),
            }),
          },
        },
      },
    },
  });
}
