import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Label schema
 */
export const LabelSchema = z.object({
  id: z.number().int().openapi({ description: 'Label ID' }),
  created_at: z.string().datetime().openapi({ description: 'When the label was created' }),
  updated_at: z.string().datetime().openapi({ description: 'When the label was last updated' }),
  name: z.string().openapi({ description: 'Label name' }),
  description: z.string().optional().openapi({ description: 'Label description' }),
  query: z.string().optional().openapi({ description: 'Label query (for dynamic labels)' }),
  label_type: z.enum(['regular', 'builtin']).optional().openapi({ description: 'Label type' }),
  label_membership_type: z.enum(['dynamic', 'manual']).optional().openapi({ description: 'Label membership type' }),
  host_count: z.number().int().optional().openapi({ description: 'Number of hosts with this label' }),
  display_text: z.string().optional().openapi({ description: 'Display text' }),
  slug: z.string().optional().openapi({ description: 'Label slug' }),
}).openapi('Label');

/**
 * Create label request
 */
export const CreateLabelRequestSchema = z.object({
  name: z.string().openapi({ description: 'Label name' }),
  description: z.string().optional().openapi({ description: 'Label description' }),
  query: z.string().optional().openapi({ description: 'SQL query for dynamic labels' }),
  platform: z.string().optional().openapi({ description: 'Platform filter (comma-separated)' }),
  hosts: z.array(z.string()).optional().openapi({ description: 'Host identifiers for manual labels' }),
}).openapi('CreateLabelRequest');

/**
 * Create label response
 */
export const CreateLabelResponseSchema = z.object({
  label: LabelSchema,
}).openapi('CreateLabelResponse');

/**
 * Update label request
 */
export const UpdateLabelRequestSchema = z.object({
  name: z.string().optional().openapi({ description: 'Label name' }),
  description: z.string().optional().openapi({ description: 'Label description' }),
  hosts: z.array(z.string()).optional().openapi({ description: 'Host identifiers for manual labels' }),
}).openapi('UpdateLabelRequest');

/**
 * List labels response
 */
export const ListLabelsResponseSchema = z.object({
  labels: z.array(LabelSchema),
}).openapi('ListLabelsResponse');

/**
 * Get label response
 */
export const GetLabelResponseSchema = z.object({
  label: LabelSchema,
}).openapi('GetLabelResponse');

/**
 * Label summary item
 */
export const LabelSummaryItemSchema = z.object({
  id: z.number().int().openapi({ description: 'Label ID' }),
  name: z.string().openapi({ description: 'Label name' }),
  description: z.string().optional().openapi({ description: 'Label description' }),
  label_type: z.string().optional().openapi({ description: 'Label type' }),
}).openapi('LabelSummaryItem');

/**
 * Labels summary response
 */
export const LabelsSummaryResponseSchema = z.object({
  labels: z.array(LabelSummaryItemSchema),
}).openapi('LabelsSummaryResponse');

// TypeScript types
export type Label = z.infer<typeof LabelSchema>;
