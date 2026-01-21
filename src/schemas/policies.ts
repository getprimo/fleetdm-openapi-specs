import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Policy schema
 */
export const PolicySchema = z.object({
  id: z.number().int().openapi({ description: 'Policy ID' }),
  name: z.string().openapi({ description: 'Policy name' }),
  query: z.string().openapi({ description: 'Policy SQL query' }),
  critical: z.boolean().optional().openapi({ description: 'Whether the policy is critical' }),
  description: z.string().optional().openapi({ description: 'Policy description' }),
  author_id: z.number().int().optional().openapi({ description: 'Author user ID' }),
  author_name: z.string().optional().openapi({ description: 'Author name' }),
  author_email: z.string().optional().openapi({ description: 'Author email' }),
  team_id: z.number().int().nullable().optional().openapi({ description: 'Team ID' }),
  resolution: z.string().nullable().optional().openapi({ description: 'Resolution instructions' }),
  platform: z.string().optional().openapi({ description: 'Target platforms' }),
  calendar_events_enabled: z.boolean().optional().openapi({ description: 'Whether calendar events are enabled' }),
  created_at: z.string().datetime().optional().openapi({ description: 'When the policy was created' }),
  updated_at: z.string().datetime().optional().openapi({ description: 'When the policy was last updated' }),
  passing_host_count: z.number().int().optional().openapi({ description: 'Count of hosts passing' }),
  failing_host_count: z.number().int().optional().openapi({ description: 'Count of hosts failing' }),
  host_count_updated_at: z.string().datetime().nullable().optional().openapi({ description: 'When host counts were updated' }),
}).openapi('Policy');

/**
 * Create policy request
 */
export const CreatePolicyRequestSchema = z.object({
  name: z.string().openapi({ description: 'Policy name' }),
  query: z.string().openapi({ description: 'Policy SQL query' }),
  description: z.string().optional().openapi({ description: 'Policy description' }),
  resolution: z.string().optional().openapi({ description: 'Resolution instructions' }),
  platform: z.string().optional().openapi({ description: 'Target platforms (comma-separated)' }),
  critical: z.boolean().optional().openapi({ description: 'Whether the policy is critical' }),
  calendar_events_enabled: z.boolean().optional().openapi({ description: 'Whether to enable calendar events' }),
  software_title_id: z.number().int().optional().openapi({ description: 'Software title ID to install on failure' }),
  script_id: z.number().int().optional().openapi({ description: 'Script ID to run on failure' }),
}).openapi('CreatePolicyRequest');

/**
 * Update policy request
 */
export const UpdatePolicyRequestSchema = z.object({
  name: z.string().optional().openapi({ description: 'Policy name' }),
  query: z.string().optional().openapi({ description: 'Policy SQL query' }),
  description: z.string().optional().openapi({ description: 'Policy description' }),
  resolution: z.string().nullable().optional().openapi({ description: 'Resolution instructions' }),
  platform: z.string().optional().openapi({ description: 'Target platforms' }),
  critical: z.boolean().optional().openapi({ description: 'Whether the policy is critical' }),
  calendar_events_enabled: z.boolean().optional().openapi({ description: 'Whether to enable calendar events' }),
  software_title_id: z.number().int().nullable().optional().openapi({ description: 'Software title ID to install on failure' }),
  script_id: z.number().int().nullable().optional().openapi({ description: 'Script ID to run on failure' }),
}).openapi('UpdatePolicyRequest');

/**
 * List policies response
 */
export const ListPoliciesResponseSchema = z.object({
  policies: z.array(PolicySchema),
}).openapi('ListPoliciesResponse');

/**
 * Get policy response
 */
export const GetPolicyResponseSchema = z.object({
  policy: PolicySchema,
}).openapi('GetPolicyResponse');

/**
 * Delete policies request
 */
export const DeletePoliciesRequestSchema = z.object({
  ids: z.array(z.number().int()).openapi({ description: 'Array of policy IDs to delete' }),
}).openapi('DeletePoliciesRequest');

/**
 * Delete policies response
 */
export const DeletePoliciesResponseSchema = z.object({
  deleted: z.number().int().openapi({ description: 'Number of policies deleted' }),
}).openapi('DeletePoliciesResponse');

/**
 * Policy count response
 */
export const PolicyCountResponseSchema = z.object({
  count: z.number().int().openapi({ description: 'Total policy count' }),
}).openapi('PolicyCountResponse');

/**
 * Reset automation request
 */
export const ResetAutomationRequestSchema = z.object({
  team_ids: z.array(z.number().int()).optional().openapi({ description: 'Team IDs' }),
  policy_ids: z.array(z.number().int()).optional().openapi({ description: 'Policy IDs' }),
}).openapi('ResetAutomationRequest');

// TypeScript types
export type Policy = z.infer<typeof PolicySchema>;
