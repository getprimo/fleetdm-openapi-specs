import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/**
 * Certificate Authority schema
 */
export const CertificateAuthoritySchema = z.object({
  id: z.number().int().openapi({ description: 'Certificate authority ID' }),
  name: z.string().openapi({ description: 'Certificate authority name' }),
  not_valid_after: z.string().datetime().openapi({ description: 'Certificate expiration date' }),
  sha256_fingerprint: z.string().openapi({ description: 'SHA256 fingerprint of the certificate' }),
}).openapi('CertificateAuthority');

/**
 * Certificate schema
 */
export const CertificateSchema = z.object({
  id: z.number().int().openapi({ description: 'Certificate ID' }),
  name: z.string().openapi({ description: 'Certificate name' }),
  serial: z.string().openapi({ description: 'Certificate serial number' }),
  not_valid_after: z.string().datetime().openapi({ description: 'Certificate expiration date' }),
  certificate_authority_id: z.number().int().openapi({ description: 'Associated certificate authority ID' }),
  sha256_fingerprint: z.string().openapi({ description: 'SHA256 fingerprint of the certificate' }),
}).openapi('Certificate');

/**
 * Create certificate authority request
 */
export const CreateCertificateAuthorityRequestSchema = z.object({
  name: z.string().openapi({ description: 'Certificate authority name' }),
  certificate: z.string().openapi({ description: 'PEM-encoded certificate' }),
  key: z.string().optional().openapi({ description: 'PEM-encoded private key' }),
}).openapi('CreateCertificateAuthorityRequest');

/**
 * Create certificate authority response
 */
export const CreateCertificateAuthorityResponseSchema = z.object({
  certificate_authority: CertificateAuthoritySchema,
}).openapi('CreateCertificateAuthorityResponse');

/**
 * Upload certificate request
 */
export const UploadCertificateRequestSchema = z.object({
  name: z.string().openapi({ description: 'Certificate name' }),
  certificate: z.string().openapi({ description: 'PEM-encoded certificate' }),
}).openapi('UploadCertificateRequest');

/**
 * Upload certificate response
 */
export const UploadCertificateResponseSchema = z.object({
  certificate: CertificateSchema,
}).openapi('UploadCertificateResponse');

/**
 * Update certificate authority request
 */
export const UpdateCertificateAuthorityRequestSchema = z.object({
  name: z.string().optional().openapi({ description: 'Certificate authority name' }),
}).openapi('UpdateCertificateAuthorityRequest');

/**
 * List certificate authorities response
 */
export const ListCertificateAuthoritiesResponseSchema = z.object({
  certificate_authorities: z.array(CertificateAuthoritySchema),
}).openapi('ListCertificateAuthoritiesResponse');

/**
 * Get certificate authority response
 */
export const GetCertificateAuthorityResponseSchema = z.object({
  certificate_authority: CertificateAuthoritySchema,
}).openapi('GetCertificateAuthorityResponse');

/**
 * List certificates response
 */
export const ListCertificatesResponseSchema = z.object({
  certificates: z.array(CertificateSchema),
}).openapi('ListCertificatesResponse');

/**
 * Get certificate response
 */
export const GetCertificateResponseSchema = z.object({
  certificate: CertificateSchema,
}).openapi('GetCertificateResponse');

/**
 * Request certificate request
 */
export const RequestCertificateRequestSchema = z.object({
  common_name: z.string().openapi({ description: 'Common name for the certificate' }),
  validity_days: z.number().int().optional().openapi({ description: 'Number of days the certificate should be valid' }),
}).openapi('RequestCertificateRequest');

/**
 * Request certificate response
 */
export const RequestCertificateResponseSchema = z.object({
  certificate: z.string().openapi({ description: 'PEM-encoded certificate' }),
  key: z.string().openapi({ description: 'PEM-encoded private key' }),
}).openapi('RequestCertificateResponse');

// TypeScript types
export type CertificateAuthority = z.infer<typeof CertificateAuthoritySchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
