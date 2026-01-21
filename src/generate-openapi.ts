import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registerActivityRoutes } from './routes/activity';
import { registerAuthRoutes } from './routes/auth';
import { registerConfigRoutes } from './routes/config';
import { registerCertificatesRoutes } from './routes/certificates';
import { registerConditionalAccessRoutes } from './routes/conditional-access';
import { registerCarvesRoutes } from './routes/carves';
import { registerHostsRoutes } from './routes/hosts';
import { registerLabelsRoutes } from './routes/labels';
import { registerProfilesRoutes } from './routes/profiles';
import { registerSetupExperienceRoutes } from './routes/setup-experience';
import { registerCommandsRoutes } from './routes/commands';
import { registerIntegrationsRoutes } from './routes/integrations';
import { registerPoliciesRoutes } from './routes/policies';
import { registerQueriesRoutes } from './routes/queries';
import { registerScriptsRoutes } from './routes/scripts';
import { registerSessionsRoutes } from './routes/sessions';
import { registerSoftwareRoutes } from './routes/software';
import { registerVulnerabilitiesRoutes } from './routes/vulnerabilities';
import { registerTargetsRoutes } from './routes/targets';
import { registerTeamsRoutes } from './routes/teams';
import { registerUsersRoutes } from './routes/users';
import { registerInvitesRoutes } from './routes/invites';
import { registerCustomVariablesRoutes } from './routes/custom-variables';
import { registerTranslatorRoutes } from './routes/translator';
import * as fs from 'fs';
import * as path from 'path';

// Create OpenAPI registry
const registry = new OpenAPIRegistry();

// Register Bearer Auth security scheme
registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'API token authentication. Get your token from My Account > Get API token in the Fleet UI.',
});

// Register all routes
registerAuthRoutes(registry);
registerActivityRoutes(registry);
registerConfigRoutes(registry);
registerCertificatesRoutes(registry);
registerConditionalAccessRoutes(registry);
registerCarvesRoutes(registry);
registerHostsRoutes(registry);
registerLabelsRoutes(registry);
registerProfilesRoutes(registry);
registerSetupExperienceRoutes(registry);
registerCommandsRoutes(registry);
registerIntegrationsRoutes(registry);
registerPoliciesRoutes(registry);
registerQueriesRoutes(registry);
registerScriptsRoutes(registry);
registerSessionsRoutes(registry);
registerSoftwareRoutes(registry);
registerVulnerabilitiesRoutes(registry);
registerTargetsRoutes(registry);
registerTeamsRoutes(registry);
registerUsersRoutes(registry);
registerInvitesRoutes(registry);
registerCustomVariablesRoutes(registry);
registerTranslatorRoutes(registry);

// Generate OpenAPI documentation
const generator = new OpenApiGeneratorV31(registry.definitions);

const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Fleet REST API',
    version: '1.0.0',
    description: 'REST API for Fleet device management platform',
    contact: {
      name: 'Fleet',
      url: 'https://fleetdm.com',
    },
  },
  servers: [
    {
      url: '{protocol}://{host}',
      description: 'Fleet server',
      variables: {
        protocol: {
          default: 'https',
          enum: ['https', 'http'],
        },
        host: {
          default: 'api.fleetdm.com',
        },
      },
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication and session management' },
    { name: 'Activities', description: 'Activity logs and audit trail' },
    { name: 'Fleet Configuration', description: 'Global Fleet configuration and settings' },
    { name: 'Certificates', description: 'Certificate authorities and certificates management' },
    { name: 'Conditional Access', description: 'Conditional access configuration for IdPs' },
    { name: 'File Carving', description: 'File carving sessions and data retrieval' },
    { name: 'Hosts', description: 'Host management, querying, and operations' },
    { name: 'Labels', description: 'Dynamic and manual label management' },
    { name: 'OS Settings', description: 'Configuration profiles and disk encryption' },
    { name: 'Setup Experience', description: 'MDM enrollment and bootstrap package configuration' },
    { name: 'Commands', description: 'Custom MDM commands' },
    { name: 'Integrations', description: 'Third-party integrations (APNs, ABM, VPP, SCIM)' },
    { name: 'Policies', description: 'Compliance policy management' },
    { name: 'Queries', description: 'Saved queries and live query execution' },
    { name: 'Scripts', description: 'Script management and execution' },
    { name: 'Sessions', description: 'User session management' },
    { name: 'Software', description: 'Software inventory and deployment' },
    { name: 'Vulnerabilities', description: 'Vulnerability information and tracking' },
    { name: 'Targets', description: 'Target selection for queries' },
    { name: 'Teams', description: 'Team management and configuration' },
    { name: 'Users', description: 'User management' },
    { name: 'Invites', description: 'User invitation management' },
    { name: 'Custom Variables', description: 'Custom variable management' },
    { name: 'Translator', description: 'Identifier translation' },
  ],
});

// Post-process: Ensure all path parameters have required: true (OpenAPI spec requirement)
if (openApiDocument.paths) {
  for (const pathItem of Object.values(openApiDocument.paths)) {
    if (!pathItem) continue;
    for (const method of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'] as const) {
      const operation = pathItem[method];
      if (operation && 'parameters' in operation && Array.isArray(operation.parameters)) {
        for (const param of operation.parameters) {
          if (param && typeof param === 'object' && 'in' in param && param.in === 'path') {
            (param as { required: boolean }).required = true;
          }
        }
      }
    }
  }
}

// Write to file
const outputPath = path.join(__dirname, '..', 'fleet-openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));

console.log('✓ OpenAPI spec generated successfully!');
console.log(`  - File: ${outputPath}`);
console.log(`  - OpenAPI Version: ${openApiDocument.openapi}`);
console.log(`  - Paths: ${Object.keys(openApiDocument.paths || {}).length}`);
console.log(`  - Schemas: ${Object.keys(openApiDocument.components?.schemas || {}).length}`);
