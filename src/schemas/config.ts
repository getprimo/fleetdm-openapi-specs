import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Org info schema
 */
export const OrgInfoSchema = z.object({
  org_name: z.string().openapi({ description: 'Organization name' }),
  org_logo_url: z.string().openapi({ description: 'Organization logo URL' }),
  org_logo_url_light_background: z.string().optional().openapi({ description: 'Organization logo URL for light backgrounds' }),
  contact_url: z.string().openapi({ description: 'Contact URL' }),
}).openapi('OrgInfo');

/**
 * Server settings schema
 */
export const ServerSettingsSchema = z.object({
  server_url: z.string().openapi({ description: 'Fleet server URL' }),
  enable_analytics: z.boolean().openapi({ description: 'Whether analytics is enabled' }),
  live_query_disabled: z.boolean().openapi({ description: 'Whether live query is disabled' }),
  query_reports_disabled: z.boolean().openapi({ description: 'Whether query reports are disabled' }),
  ai_features_disabled: z.boolean().openapi({ description: 'Whether AI features are disabled' }),
}).openapi('ServerSettings');

/**
 * SMTP settings schema
 */
export const SMTPSettingsSchema = z.object({
  enable_smtp: z.boolean().openapi({ description: 'Whether SMTP is enabled' }),
  configured: z.boolean().openapi({ description: 'Whether SMTP is configured' }),
  sender_address: z.string().openapi({ description: 'Sender email address' }),
  server: z.string().openapi({ description: 'SMTP server' }),
  port: z.number().int().openapi({ description: 'SMTP port' }),
  authentication_type: z.string().openapi({ description: 'Authentication type' }),
  user_name: z.string().openapi({ description: 'SMTP username' }),
  password: z.string().openapi({ description: 'SMTP password (masked)' }),
  enable_ssl_tls: z.boolean().openapi({ description: 'Whether SSL/TLS is enabled' }),
  authentication_method: z.string().openapi({ description: 'Authentication method' }),
  domain: z.string().openapi({ description: 'SMTP domain' }),
  verify_ssl_certs: z.boolean().openapi({ description: 'Whether to verify SSL certificates' }),
  enable_start_tls: z.boolean().openapi({ description: 'Whether STARTTLS is enabled' }),
}).openapi('SMTPSettings');

/**
 * SSO settings schema
 */
export const SSOSettingsFullSchema = z.object({
  entity_id: z.string().openapi({ description: 'Entity ID' }),
  issuer_uri: z.string().openapi({ description: 'Issuer URI' }),
  idp_image_url: z.string().openapi({ description: 'IdP image URL' }),
  metadata: z.string().openapi({ description: 'SAML metadata' }),
  metadata_url: z.string().openapi({ description: 'SAML metadata URL' }),
  idp_name: z.string().openapi({ description: 'IdP name' }),
  enable_sso: z.boolean().openapi({ description: 'Whether SSO is enabled' }),
  enable_sso_idp_login: z.boolean().openapi({ description: 'Whether IdP-initiated login is enabled' }),
  enable_jit_provisioning: z.boolean().openapi({ description: 'Whether JIT provisioning is enabled' }),
  sso_server_url: z.string().optional().openapi({ description: 'SSO server URL' }),
}).openapi('SSOSettingsFull');

/**
 * Host expiry settings schema
 */
export const HostExpirySettingsSchema = z.object({
  host_expiry_enabled: z.boolean().openapi({ description: 'Whether host expiry is enabled' }),
  host_expiry_window: z.number().int().openapi({ description: 'Host expiry window in days' }),
}).openapi('HostExpirySettings');

/**
 * Activity expiry settings schema
 */
export const ActivityExpirySettingsSchema = z.object({
  activity_expiry_enabled: z.boolean().openapi({ description: 'Whether activity expiry is enabled' }),
  activity_expiry_window: z.number().int().openapi({ description: 'Activity expiry window in days' }),
}).openapi('ActivityExpirySettings');

/**
 * Features schema
 */
export const FeaturesSchema = z.object({
  enable_host_users: z.boolean().openapi({ description: 'Whether host users feature is enabled' }),
  enable_software_inventory: z.boolean().openapi({ description: 'Whether software inventory is enabled' }),
  additional_queries: z.any().nullable().openapi({ description: 'Additional queries configuration' }),
}).openapi('Features');

/**
 * License schema
 */
export const LicenseSchema = z.object({
  tier: z.string().openapi({ description: 'License tier' }),
  organization: z.string().openapi({ description: 'Organization name' }),
  device_count: z.number().int().openapi({ description: 'Licensed device count' }),
  managed_cloud: z.boolean().openapi({ description: 'Whether this is managed cloud' }),
  expiration: z.string().datetime().openapi({ description: 'License expiration date' }),
  note: z.string().openapi({ description: 'License note' }),
}).openapi('License');

/**
 * Config response schema
 */
export const ConfigResponseSchema = z.object({
  org_info: OrgInfoSchema,
  server_settings: ServerSettingsSchema,
  smtp_settings: SMTPSettingsSchema.optional(),
  sso_settings: SSOSettingsFullSchema.optional(),
  host_expiry_settings: HostExpirySettingsSchema,
  activity_expiry_settings: ActivityExpirySettingsSchema,
  features: FeaturesSchema,
  license: LicenseSchema,
  mdm: z.any().optional().openapi({ description: 'MDM configuration' }),
  agent_options: z.any().optional().openapi({ description: 'Agent options configuration' }),
  webhook_settings: z.any().optional().openapi({ description: 'Webhook settings' }),
  integrations: z.any().optional().openapi({ description: 'Integrations configuration' }),
  logging: z.any().optional().openapi({ description: 'Logging configuration' }),
  update_interval: z.any().optional().openapi({ description: 'Update interval configuration' }),
  vulnerabilities: z.any().optional().openapi({ description: 'Vulnerabilities configuration' }),
  conditional_access: z.any().optional().openapi({ description: 'Conditional access configuration' }),
  gitops: z.any().optional().openapi({ description: 'GitOps configuration' }),
}).openapi('ConfigResponse');

/**
 * Update config request schema
 */
export const UpdateConfigRequestSchema = z.object({
  org_info: OrgInfoSchema.partial().optional(),
  server_settings: ServerSettingsSchema.partial().optional(),
  smtp_settings: SMTPSettingsSchema.partial().optional(),
  sso_settings: SSOSettingsFullSchema.partial().optional(),
  host_expiry_settings: HostExpirySettingsSchema.partial().optional(),
  activity_expiry_settings: ActivityExpirySettingsSchema.partial().optional(),
  features: FeaturesSchema.partial().optional(),
  agent_options: z.any().optional(),
  webhook_settings: z.any().optional(),
  integrations: z.any().optional(),
  mdm: z.any().optional(),
  gitops: z.any().optional(),
  conditional_access: z.any().optional(),
  scripts: z.array(z.string()).optional(),
  yara_rules: z.array(z.string()).optional(),
}).openapi('UpdateConfigRequest');

/**
 * Update config query params
 */
export const UpdateConfigQuerySchema = z.object({
  force: z.coerce.boolean().optional().openapi({ description: 'Force apply agent options even with validation errors' }),
  dry_run: z.coerce.boolean().optional().openapi({ description: 'Validate configuration without applying changes' }),
}).openapi('UpdateConfigQuery');

/**
 * Enroll secret schema
 */
export const EnrollSecretSchema = z.object({
  secret: z.string().openapi({ description: 'The enroll secret string' }),
  created_at: z.string().datetime().openapi({ description: 'When the secret was created' }),
  team_id: z.number().int().nullable().optional().openapi({ description: 'Team ID if team-specific' }),
}).openapi('EnrollSecret');

/**
 * Enroll secret spec response
 */
export const EnrollSecretSpecResponseSchema = z.object({
  spec: z.object({
    secrets: z.array(EnrollSecretSchema),
  }),
}).openapi('EnrollSecretSpecResponse');

/**
 * Apply enroll secret spec request
 */
export const ApplyEnrollSecretSpecRequestSchema = z.object({
  spec: z.object({
    secrets: z.array(z.object({
      secret: z.string().openapi({ description: 'The enroll secret string' }),
    })),
  }),
}).openapi('ApplyEnrollSecretSpecRequest');

/**
 * Team secrets response
 */
export const TeamSecretsResponseSchema = z.object({
  secrets: z.array(EnrollSecretSchema),
}).openapi('TeamSecretsResponse');

/**
 * Modify team secrets request
 */
export const ModifyTeamSecretsRequestSchema = z.object({
  secrets: z.array(z.object({
    secret: z.string().openapi({ description: 'The enroll secret string' }),
  })),
}).openapi('ModifyTeamSecretsRequest');

/**
 * Version response schema
 */
export const VersionResponseSchema = z.object({
  version: z.string().openapi({ description: 'Fleet version' }),
  branch: z.string().openapi({ description: 'Git branch' }),
  revision: z.string().openapi({ description: 'Git revision' }),
  go_version: z.string().openapi({ description: 'Go version' }),
  build_date: z.string().openapi({ description: 'Build date' }),
  build_user: z.string().openapi({ description: 'Build user' }),
}).openapi('VersionResponse');

/**
 * Certificate response
 */
export const CertificateResponseSchema = z.object({
  certificate_chain: z.string().openapi({ description: 'The Fleet certificate chain' }),
}).openapi('CertificateResponse');

// TypeScript types
export type ConfigResponse = z.infer<typeof ConfigResponseSchema>;
export type UpdateConfigRequest = z.infer<typeof UpdateConfigRequestSchema>;
export type VersionResponse = z.infer<typeof VersionResponseSchema>;
