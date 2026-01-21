import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Team schema for user responses
 */
export const TeamRoleSchema = z.object({
  id: z.number().int().openapi({ description: 'Team ID' }),
  name: z.string().openapi({ description: 'Team name' }),
  role: z.string().openapi({ description: 'User role in the team' }),
}).openapi('TeamRole');

/**
 * User schema
 */
export const UserSchema = z.object({
  created_at: z.string().datetime().openapi({ description: 'When the user was created' }),
  updated_at: z.string().datetime().openapi({ description: 'When the user was last updated' }),
  id: z.number().int().openapi({ description: 'User ID' }),
  name: z.string().openapi({ description: 'User full name' }),
  email: z.string().email().openapi({ description: 'User email' }),
  enabled: z.boolean().openapi({ description: 'Whether the user is enabled' }),
  force_password_reset: z.boolean().openapi({ description: 'Whether user must reset password' }),
  gravatar_url: z.string().openapi({ description: 'Gravatar URL' }),
  sso_enabled: z.boolean().openapi({ description: 'Whether SSO is enabled' }),
  mfa_enabled: z.boolean().optional().openapi({ description: 'Whether MFA is enabled' }),
  global_role: z.string().nullable().openapi({ description: 'Global role (admin, maintainer, observer, etc.)' }),
  teams: z.array(TeamRoleSchema).openapi({ description: 'Team memberships' }),
}).openapi('User');

/**
 * Available team schema
 */
export const AvailableTeamSchema = z.object({
  id: z.number().int().openapi({ description: 'Team ID' }),
  name: z.string().openapi({ description: 'Team name' }),
  description: z.string().optional().openapi({ description: 'Team description' }),
}).openapi('AvailableTeam');

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({ description: 'The user\'s email', example: 'janedoe@example.com' }),
  password: z.string().openapi({ description: 'The user\'s plain text password', example: 'VArCjNW7CfsxGp67' }),
}).openapi('LoginRequest');

/**
 * Login response schema
 */
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string().openapi({ description: 'API token for authentication' }),
}).openapi('LoginResponse');

/**
 * Forgot password request schema
 */
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email().openapi({ description: 'The email of the user requesting the reset password link' }),
}).openapi('ForgotPasswordRequest');

/**
 * Change password request schema
 */
export const ChangePasswordRequestSchema = z.object({
  old_password: z.string().openapi({ description: 'The user\'s old password' }),
  new_password: z.string().openapi({ description: 'The user\'s new password' }),
}).openapi('ChangePasswordRequest');

/**
 * Reset password request schema
 */
export const ResetPasswordRequestSchema = z.object({
  new_password: z.string().openapi({ description: 'The new password' }),
  new_password_confirmation: z.string().openapi({ description: 'Confirmation for the new password' }),
  password_reset_token: z.string().openapi({ description: 'The token provided to the user in the password reset email' }),
}).openapi('ResetPasswordRequest');

/**
 * Perform required password reset request schema
 */
export const PerformRequiredPasswordResetRequestSchema = z.object({
  new_password: z.string().openapi({ description: 'The new password' }),
}).openapi('PerformRequiredPasswordResetRequest');

/**
 * Perform required password reset response schema
 */
export const PerformRequiredPasswordResetResponseSchema = z.object({
  user: UserSchema,
}).openapi('PerformRequiredPasswordResetResponse');

/**
 * Me response schema
 */
export const MeResponseSchema = z.object({
  user: UserSchema,
  available_teams: z.array(AvailableTeamSchema).optional().openapi({ description: 'Teams available to the user' }),
}).openapi('MeResponse');

/**
 * SSO settings schema
 */
export const SSOSettingsSchema = z.object({
  idp_name: z.string().openapi({ description: 'Identity provider name' }),
  idp_image_url: z.string().openapi({ description: 'Identity provider image URL' }),
  sso_enabled: z.boolean().openapi({ description: 'Whether SSO is enabled' }),
}).openapi('SSOSettings');

/**
 * SSO config response schema
 */
export const SSOConfigResponseSchema = z.object({
  settings: SSOSettingsSchema,
}).openapi('SSOConfigResponse');

/**
 * Initiate SSO request schema
 */
export const InitiateSSORequestSchema = z.object({
  relay_url: z.string().openapi({ description: 'The relative url to be navigated to after successful sign in' }),
}).openapi('InitiateSSORequest');

/**
 * SSO callback request schema
 */
export const SSOCallbackRequestSchema = z.object({
  SAMLResponse: z.string().openapi({ description: 'The SAML response from the identity provider' }),
}).openapi('SSOCallbackRequest');

// TypeScript types
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
