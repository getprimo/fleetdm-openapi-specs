# Fleet OpenAPI Specs

## Commands

- `npm run generate` - Generate the OpenAPI spec to `fleet-openapi.json`
- `npm run serve` - Preview the API docs locally at http://localhost:3000

## Server Configuration

The OpenAPI spec uses server variables for flexible configuration. In Swagger UI, you can:

- Select `http` or `https` protocol from the dropdown
- Edit the host field to point to your Fleet server (default: `api.fleetdm.com`)

## Project Structure

- `src/generate-openapi.ts` - Main OpenAPI generator
- `src/swagger-preview.ts` - Local Swagger UI server
- `src/schemas/` - Zod schemas for API resources
- `src/routes/` - Route registrations
- `fleet-openapi.json` - Generated OpenAPI spec
