import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

/**
 * Activity details schema
 */
export const ActivityDetailsSchema = z.object({
  status: z.string().optional().openapi({ description: 'Status of the activity' }),
  host_id: z.number().optional().openapi({ description: 'ID of the host' }),
  host_display_name: z.string().optional().openapi({ description: 'Display name of the host' }),
  policy_id: z.number().nullable().optional().openapi({ description: 'ID of the policy' }),
  policy_name: z.string().nullable().optional().openapi({ description: 'Name of the policy' }),
  install_uuid: z.string().optional().openapi({ description: 'Installation UUID' }),
  self_service: z.boolean().optional().openapi({ description: 'Whether it was self-service' }),
  software_title: z.string().optional().openapi({ description: 'Software title' }),
  software_package: z.string().optional().openapi({ description: 'Software package name' }),
  team_id: z.number().optional().openapi({ description: 'ID of the team' }),
  team_name: z.string().optional().openapi({ description: 'Name of the team' }),
}).passthrough().openapi('ActivityDetails', {
  description: 'Activity detail information varies by activity type'
});

/**
 * Single activity schema
 */
export const ActivitySchema = z.object({
  created_at: z.string().datetime().openapi({ 
    description: 'When the activity was created',
    example: '2023-07-27T14:35:08Z'
  }),
  id: z.number().int().openapi({ description: 'Unique identifier for the activity' }),
  actor_full_name: z.string().optional().openapi({ description: 'Full name of the actor' }),
  actor_id: z.number().int().optional().openapi({ description: 'ID of the actor' }),
  actor_gravatar: z.string().optional().openapi({ description: 'Gravatar URL of the actor' }),
  actor_email: z.string().email().optional().openapi({ description: 'Email of the actor' }),
  type: z.string().openapi({ 
    description: 'Type of activity',
    example: 'installed_software'
  }),
  fleet_initiated: z.boolean().openapi({ 
    description: 'Whether the activity was initiated by Fleet'
  }),
  details: ActivityDetailsSchema,
}).openapi('Activity', {
  description: 'Represents a single activity in Fleet'
});

/**
 * Pagination metadata schema
 */
export const MetaSchema = z.object({
  has_next_results: z.boolean().openapi({ description: 'Whether there are more results available' }),
  has_previous_results: z.boolean().openapi({ description: 'Whether there are previous results' }),
}).openapi('Meta', {
  description: 'Pagination metadata'
});

/**
 * List activities response schema
 */
export const ListActivitiesResponseSchema = z.object({
  activities: z.array(ActivitySchema).openapi({ description: 'Array of activities' }),
  meta: MetaSchema,
}).openapi('ListActivitiesResponse', {
  description: 'Response for list activities endpoint'
});

/**
 * List activities query parameters schema
 */
export const ListActivitiesQuerySchema = z.object({
  page: z.coerce.number().int().optional().openapi({ 
    description: 'Page number of the results to fetch',
    example: 0
  }),
  per_page: z.coerce.number().int().optional().openapi({ 
    description: 'Results per page',
    example: 10
  }),
  order_key: z.string().optional().openapi({ 
    description: 'What to order results by. Can be any column in the activities table',
    example: 'created_at'
  }),
  order_direction: z.enum(['asc', 'desc']).optional().openapi({ 
    description: 'The direction of the order given the order key. Default is "asc"',
    example: 'desc'
  }),
  query: z.string().optional().openapi({ 
    description: 'Search query keywords. Searchable fields include actor_full_name and actor_email'
  }),
  activity_type: z.string().optional().openapi({ 
    description: 'Indicates the activity type to filter by'
  }),
  start_created_at: z.string().datetime().optional().openapi({ 
    description: 'Filters to include only activities that happened after this date'
  }),
  end_created_at: z.string().datetime().optional().openapi({ 
    description: 'Filters to include only activities that happened before this date. If not specified, set to now'
  }),
}).openapi('ListActivitiesQuery');

// TypeScript types derived from schemas
export type ActivityDetails = z.infer<typeof ActivityDetailsSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type ListActivitiesResponse = z.infer<typeof ListActivitiesResponseSchema>;
export type ListActivitiesQuery = z.infer<typeof ListActivitiesQuerySchema>;
