import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  ListActivitiesQuerySchema,
  ListActivitiesResponseSchema
} from '../schemas/activity';

export function registerActivityRoutes(registry: OpenAPIRegistry) {
  // Register the GET /api/v1/fleet/activities endpoint
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/activities',
    summary: 'List activities',
    description: `Returns a list of the activities that have been performed in Fleet.

For a comprehensive list of activity types and detailed information, please see the [audit logs](https://fleetdm.com/docs/using-fleet/audit-activities) page.`,
    tags: ['Activities'],
    security: [{ BearerAuth: [] }],
    request: {
      query: ListActivitiesQuerySchema,
    },
    responses: {
      200: {
        description: 'Successfully retrieved activities',
        content: {
          'application/json': {
            schema: ListActivitiesResponseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
      },
    },
  });
}
