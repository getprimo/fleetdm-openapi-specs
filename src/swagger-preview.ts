import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Generate the OpenAPI spec first
console.log('Generating OpenAPI spec...');
execSync('npm run generate', { stdio: 'inherit' });

// Load the generated spec
const specPath = path.join(__dirname, '..', 'fleet-openapi.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Serve Swagger UI
app.use('/', swaggerUi.serve, swaggerUi.setup(spec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fleet API Docs',
}));

app.listen(port, () => {
  console.log(`\n🚀 Swagger UI available at http://localhost:${port}`);
  console.log('   Press Ctrl+C to stop\n');
});
