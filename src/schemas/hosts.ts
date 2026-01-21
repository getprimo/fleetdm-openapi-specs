import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { MetaSchema } from './activity';

extendZodWithOpenApi(z);

/**
 * Host schema
 */
export const HostSchema = z.object({
  id: z.number().int().openapi({ description: 'Host ID' }),
  created_at: z.string().datetime().openapi({ description: 'When the host was created' }),
  updated_at: z.string().datetime().openapi({ description: 'When the host was last updated' }),
  detail_updated_at: z.string().datetime().optional().openapi({ description: 'When host details were last updated' }),
  label_updated_at: z.string().datetime().optional().openapi({ description: 'When labels were last updated' }),
  policy_updated_at: z.string().datetime().optional().openapi({ description: 'When policies were last updated' }),
  last_enrolled_at: z.string().datetime().optional().openapi({ description: 'When the host last enrolled' }),
  seen_time: z.string().datetime().optional().openapi({ description: 'When the host was last seen' }),
  refetch_requested: z.boolean().optional().openapi({ description: 'Whether a refetch was requested' }),
  hostname: z.string().openapi({ description: 'Host hostname' }),
  uuid: z.string().openapi({ description: 'Host UUID' }),
  platform: z.string().openapi({ description: 'Host platform (darwin, windows, linux, etc.)' }),
  osquery_version: z.string().optional().openapi({ description: 'Osquery version' }),
  os_version: z.string().optional().openapi({ description: 'Operating system version' }),
  build: z.string().optional().openapi({ description: 'OS build' }),
  platform_like: z.string().optional().openapi({ description: 'Platform-like' }),
  code_name: z.string().optional().openapi({ description: 'OS code name' }),
  uptime: z.number().int().optional().openapi({ description: 'Uptime in seconds' }),
  memory: z.number().int().optional().openapi({ description: 'Memory in bytes' }),
  cpu_type: z.string().optional().openapi({ description: 'CPU type' }),
  cpu_subtype: z.string().optional().openapi({ description: 'CPU subtype' }),
  cpu_brand: z.string().optional().openapi({ description: 'CPU brand' }),
  cpu_physical_cores: z.number().int().optional().openapi({ description: 'Physical CPU cores' }),
  cpu_logical_cores: z.number().int().optional().openapi({ description: 'Logical CPU cores' }),
  hardware_vendor: z.string().optional().openapi({ description: 'Hardware vendor' }),
  hardware_model: z.string().optional().openapi({ description: 'Hardware model' }),
  hardware_version: z.string().optional().openapi({ description: 'Hardware version' }),
  hardware_serial: z.string().optional().openapi({ description: 'Hardware serial number' }),
  computer_name: z.string().optional().openapi({ description: 'Computer name' }),
  display_name: z.string().optional().openapi({ description: 'Display name' }),
  public_ip: z.string().optional().openapi({ description: 'Public IP address' }),
  primary_ip: z.string().optional().openapi({ description: 'Primary IP address' }),
  primary_mac: z.string().optional().openapi({ description: 'Primary MAC address' }),
  distributed_interval: z.number().int().optional().openapi({ description: 'Distributed interval' }),
  config_tls_refresh: z.number().int().optional().openapi({ description: 'Config TLS refresh interval' }),
  logger_tls_period: z.number().int().optional().openapi({ description: 'Logger TLS period' }),
  team_id: z.number().int().nullable().optional().openapi({ description: 'Team ID' }),
  team_name: z.string().nullable().optional().openapi({ description: 'Team name' }),
  gigs_disk_space_available: z.number().optional().openapi({ description: 'Available disk space in GB' }),
  percent_disk_space_available: z.number().optional().openapi({ description: 'Available disk space percentage' }),
  gigs_total_disk_space: z.number().optional().openapi({ description: 'Total disk space in GB' }),
  disk_encryption_enabled: z.boolean().optional().openapi({ description: 'Whether disk encryption is enabled' }),
  status: z.enum(['online', 'offline', 'missing', 'new']).optional().openapi({ description: 'Host status' }),
}).openapi('Host');

/**
 * List hosts query params
 */
export const ListHostsQuerySchema = z.object({
  page: z.coerce.number().int().optional().openapi({ description: 'Page number' }),
  per_page: z.coerce.number().int().optional().openapi({ description: 'Results per page' }),
  order_key: z.string().optional().openapi({ description: 'Column to order by' }),
  order_direction: z.enum(['asc', 'desc']).optional().openapi({ description: 'Order direction' }),
  query: z.string().optional().openapi({ description: 'Search query' }),
  team_id: z.coerce.number().int().optional().openapi({ description: 'Team ID filter' }),
  label_id: z.coerce.number().int().optional().openapi({ description: 'Label ID filter' }),
  status: z.enum(['new', 'online', 'offline', 'missing']).optional().openapi({ description: 'Status filter' }),
  mdm_id: z.coerce.number().int().optional().openapi({ description: 'MDM solution ID filter' }),
  mdm_name: z.string().optional().openapi({ description: 'MDM solution name filter' }),
  mdm_enrollment_status: z.enum(['automatic', 'manual', 'unenrolled', 'pending']).optional().openapi({ description: 'MDM enrollment status filter' }),
  macos_settings: z.enum(['verified', 'verifying', 'pending', 'failed']).optional().openapi({ description: 'macOS settings status filter' }),
  munki_issue_id: z.coerce.number().int().optional().openapi({ description: 'Munki issue ID filter' }),
  software_id: z.coerce.number().int().optional().openapi({ description: 'Software ID filter' }),
  software_version_id: z.coerce.number().int().optional().openapi({ description: 'Software version ID filter' }),
  software_title_id: z.coerce.number().int().optional().openapi({ description: 'Software title ID filter' }),
  software_status: z.enum(['installed', 'pending', 'failed']).optional().openapi({ description: 'Software status filter' }),
  os_id: z.coerce.number().int().optional().openapi({ description: 'OS ID filter' }),
  os_name: z.string().optional().openapi({ description: 'OS name filter' }),
  os_version: z.string().optional().openapi({ description: 'OS version filter' }),
  vulnerability: z.string().optional().openapi({ description: 'CVE filter' }),
  device_mapping: z.coerce.boolean().optional().openapi({ description: 'Include device mapping' }),
  populate_software: z.coerce.boolean().optional().openapi({ description: 'Include software' }),
  populate_policies: z.coerce.boolean().optional().openapi({ description: 'Include policies' }),
  populate_users: z.coerce.boolean().optional().openapi({ description: 'Include users' }),
  populate_labels: z.coerce.boolean().optional().openapi({ description: 'Include labels' }),
  low_disk_space: z.coerce.number().int().optional().openapi({ description: 'Low disk space threshold in GB' }),
  disable_failing_policies: z.coerce.boolean().optional().openapi({ description: 'Exclude hosts failing policies' }),
  policy_id: z.coerce.number().int().optional().openapi({ description: 'Policy ID filter' }),
  policy_response: z.enum(['pass', 'fail']).optional().openapi({ description: 'Policy response filter' }),
  bootstrap_package: z.enum(['installed', 'pending', 'failed']).optional().openapi({ description: 'Bootstrap package status filter' }),
}).openapi('ListHostsQuery');

/**
 * List hosts response
 */
export const ListHostsResponseSchema = z.object({
  hosts: z.array(HostSchema),
  software: z.any().optional(),
  software_title: z.any().optional(),
  munki_issue: z.any().optional(),
  mobile_device_management_solution: z.any().optional(),
}).openapi('ListHostsResponse');

/**
 * Host count response
 */
export const HostCountResponseSchema = z.object({
  count: z.number().int().openapi({ description: 'Total host count' }),
}).openapi('HostCountResponse');

/**
 * Host summary response
 */
export const HostSummaryResponseSchema = z.object({
  totals_hosts_count: z.number().int().openapi({ description: 'Total hosts count' }),
  online_count: z.number().int().openapi({ description: 'Online hosts count' }),
  offline_count: z.number().int().openapi({ description: 'Offline hosts count' }),
  mia_count: z.number().int().openapi({ description: 'Missing in action count' }),
  missing_30_days_count: z.number().int().openapi({ description: 'Missing 30 days count' }),
  new_count: z.number().int().openapi({ description: 'New hosts count' }),
  all_linux_count: z.number().int().openapi({ description: 'All Linux hosts count' }),
  low_disk_space_count: z.number().int().optional().openapi({ description: 'Low disk space count' }),
  builtin_labels: z.array(z.any()).optional().openapi({ description: 'Built-in labels' }),
  platforms: z.array(z.object({
    platform: z.string(),
    hosts_count: z.number().int(),
  })).optional().openapi({ description: 'Platform counts' }),
}).openapi('HostSummaryResponse');

/**
 * Get host response
 */
export const GetHostResponseSchema = z.object({
  host: HostSchema.extend({
    labels: z.array(z.any()).optional(),
    packs: z.array(z.any()).optional(),
    policies: z.array(z.any()).optional(),
    software: z.array(z.any()).optional(),
    users: z.array(z.any()).optional(),
  }),
}).openapi('GetHostResponse');

/**
 * Transfer hosts request
 */
export const TransferHostsRequestSchema = z.object({
  team_id: z.number().int().nullable().openapi({ description: 'Target team ID (null for no team)' }),
  hosts: z.array(z.number().int()).openapi({ description: 'Array of host IDs to transfer' }),
}).openapi('TransferHostsRequest');

/**
 * Transfer hosts by filter request
 */
export const TransferHostsByFilterRequestSchema = z.object({
  team_id: z.number().int().nullable().openapi({ description: 'Target team ID (null for no team)' }),
  filters: z.object({
    label_id: z.number().int().optional(),
    status: z.string().optional(),
    query: z.string().optional(),
    team_id: z.number().int().optional(),
  }).optional(),
}).openapi('TransferHostsByFilterRequest');

/**
 * Delete hosts request
 */
export const DeleteHostsRequestSchema = z.object({
  ids: z.array(z.number().int()).optional().openapi({ description: 'Array of host IDs to delete' }),
  filters: z.object({
    label_id: z.number().int().optional(),
    status: z.string().optional(),
    query: z.string().optional(),
    team_id: z.number().int().optional(),
  }).optional(),
}).openapi('DeleteHostsRequest');

/**
 * Device mapping request
 */
export const DeviceMappingRequestSchema = z.object({
  email: z.string().email().openapi({ description: 'Email to associate with the host' }),
}).openapi('DeviceMappingRequest');

/**
 * Host health response
 */
export const HostHealthResponseSchema = z.object({
  host_id: z.number().int(),
  os_version: z.string().optional(),
  disk_encryption_enabled: z.boolean().optional(),
  failing_policies_count: z.number().int().optional(),
  vulnerable_software_count: z.number().int().optional(),
}).openapi('HostHealthResponse');

/**
 * Host MDM response
 */
export const HostMDMResponseSchema = z.object({
  enrollment_status: z.string().nullable().optional(),
  server_url: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  id: z.number().int().nullable().optional(),
}).openapi('HostMDMResponse');

/**
 * Host encryption key response
 */
export const HostEncryptionKeyResponseSchema = z.object({
  host_id: z.number().int(),
  encryption_key: z.object({
    key: z.string(),
    updated_at: z.string().datetime(),
  }),
}).openapi('HostEncryptionKeyResponse');

/**
 * Host activities response
 */
export const HostActivitiesResponseSchema = z.object({
  activities: z.array(z.any()),
  meta: MetaSchema,
}).openapi('HostActivitiesResponse');

/**
 * Host query request
 */
export const HostQueryRequestSchema = z.object({
  query: z.string().openapi({ description: 'SQL query to run' }),
}).openapi('HostQueryRequest');

/**
 * Host labels request
 */
export const HostLabelsRequestSchema = z.object({
  labels: z.array(z.string()).openapi({ description: 'Label names to add or remove' }),
}).openapi('HostLabelsRequest');

// TypeScript types
export type Host = z.infer<typeof HostSchema>;
export type ListHostsQuery = z.infer<typeof ListHostsQuerySchema>;
