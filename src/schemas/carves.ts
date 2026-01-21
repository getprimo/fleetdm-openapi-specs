import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Carve session schema
 */
export const CarveSessionSchema = z.object({
  id: z.number().int().openapi({ description: 'Carve session ID' }),
  created_at: z.string().datetime().openapi({ description: 'When the carve was created' }),
  host_id: z.number().int().openapi({ description: 'Host ID' }),
  name: z.string().openapi({ description: 'Carve name' }),
  block_count: z.number().int().openapi({ description: 'Number of blocks' }),
  block_size: z.number().int().openapi({ description: 'Block size in bytes' }),
  carve_size: z.number().int().openapi({ description: 'Total carve size in bytes' }),
  carve_id: z.string().openapi({ description: 'Carve ID' }),
  request_id: z.string().openapi({ description: 'Request ID' }),
  session_id: z.string().openapi({ description: 'Session ID' }),
  expired: z.boolean().openapi({ description: 'Whether the carve has expired' }),
  max_block: z.number().int().openapi({ description: 'Maximum block number received' }),
}).openapi('CarveSession');

/**
 * List carves response
 */
export const ListCarvesResponseSchema = z.object({
  carves: z.array(CarveSessionSchema),
}).openapi('ListCarvesResponse');

/**
 * Get carve response
 */
export const GetCarveResponseSchema = z.object({
  carve: CarveSessionSchema,
}).openapi('GetCarveResponse');

/**
 * Get carve block response
 */
export const GetCarveBlockResponseSchema = z.object({
  data: z.string().openapi({ description: 'Base64-encoded block data' }),
}).openapi('GetCarveBlockResponse');

// TypeScript types
export type CarveSession = z.infer<typeof CarveSessionSchema>;
