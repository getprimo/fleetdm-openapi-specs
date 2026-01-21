import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  ForgotPasswordRequestSchema,
  ChangePasswordRequestSchema,
  ResetPasswordRequestSchema,
  PerformRequiredPasswordResetRequestSchema,
  PerformRequiredPasswordResetResponseSchema,
  MeResponseSchema,
  SSOConfigResponseSchema,
  InitiateSSORequestSchema,
  SSOCallbackRequestSchema,
} from '../schemas/auth';

export function registerAuthRoutes(registry: OpenAPIRegistry) {
  // POST /api/v1/fleet/login
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/login',
    summary: 'Log in',
    description: `Authenticates the user with the specified credentials. Use the token returned from this endpoint to authenticate further API requests.

> Logging in via the API is not supported for SSO and MFA users. The API token can instead be retrieved from the "My account" page in the UI (/profile).`,
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully authenticated',
        content: {
          'application/json': {
            schema: LoginResponseSchema,
          },
        },
      },
      202: {
        description: 'MFA required - Magic link email sent',
      },
      401: {
        description: 'Authentication failed',
      },
      429: {
        description: 'Too many requests - Rate limiting',
      },
    },
  });

  // POST /api/v1/fleet/logout
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/logout',
    summary: 'Log out',
    description: 'Logs out the authenticated user.',
    tags: ['Authentication'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully logged out',
      },
    },
  });

  // POST /api/v1/fleet/forgot_password
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/forgot_password',
    summary: 'Forgot password',
    description: 'Sends a password reset email to the specified email. Requires that SMTP or SES is configured for your Fleet server.',
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ForgotPasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset email sent',
      },
      500: {
        description: 'Email not configured',
      },
    },
  });

  // POST /api/v1/fleet/change_password
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/change_password',
    summary: 'Update password',
    description: 'Changes the password for the authenticated user.',
    tags: ['Authentication'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ChangePasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password changed successfully',
      },
      422: {
        description: 'Validation failed - old password does not match',
      },
    },
  });

  // POST /api/v1/fleet/reset_password
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/reset_password',
    summary: 'Reset password',
    description: 'Resets a user\'s password. Which user is determined by the password reset token used.',
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ResetPasswordRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successfully',
      },
    },
  });

  // GET /api/v1/fleet/me
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/me',
    summary: 'Me',
    description: 'Retrieves the user data for the authenticated user.',
    tags: ['Authentication'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'Successfully retrieved user data',
        content: {
          'application/json': {
            schema: MeResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/perform_required_password_reset
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/perform_required_password_reset',
    summary: 'Perform required password reset',
    description: 'Resets the password of the authenticated user. Requires that `force_password_reset` is set to `true` prior to the request.',
    tags: ['Authentication'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: PerformRequiredPasswordResetRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successfully',
        content: {
          'application/json': {
            schema: PerformRequiredPasswordResetResponseSchema,
          },
        },
      },
    },
  });

  // GET /api/v1/fleet/sso
  registry.registerPath({
    method: 'get',
    path: '/api/v1/fleet/sso',
    summary: 'SSO config',
    description: 'Gets the current SSO configuration.',
    tags: ['Authentication'],
    responses: {
      200: {
        description: 'Successfully retrieved SSO configuration',
        content: {
          'application/json': {
            schema: SSOConfigResponseSchema,
          },
        },
      },
    },
  });

  // POST /api/v1/fleet/sso
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/sso',
    summary: 'Initiate SSO',
    description: 'Initiates SSO authentication. A successful response contains an HTTP cookie that needs to be sent on the callback request.',
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: InitiateSSORequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'SSO initiated successfully',
      },
      500: {
        description: 'SSO configuration error',
      },
    },
  });

  // POST /api/v1/fleet/sso/callback
  registry.registerPath({
    method: 'post',
    path: '/api/v1/fleet/sso/callback',
    summary: 'SSO callback',
    description: 'This is the callback endpoint that the identity provider will use to send security assertions to Fleet.',
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SSOCallbackRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'SSO authentication successful',
      },
    },
  });
}
