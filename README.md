# FleetDM OpenAPI Spec Generator

Generate OpenAPI 3.0 specifications for the FleetDM REST API using **Zod 4** schemas and **@asteasolutions/zod-to-openapi**.

## Overview

This project uses [Zod](https://github.com/colinhacks/zod) for schema validation and [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) to automatically generate OpenAPI specifications. This approach provides:

- **Type-safe schemas** with TypeScript
- **Runtime validation** using Zod
- **Automatic OpenAPI generation** from schemas
- **Single source of truth** for data structures
- **Swagger UI** for API documentation

## Project Structure

```
fleetdm-specs/
├── src/
│   ├── schemas/
│   │   └── activity.ts          # Zod schemas for Activities
│   └── generate-openapi.ts      # OpenAPI spec generator
├── .claude/
│   └── commands/
│       └── add-fleet-route.md   # Claude Code command for adding routes
├── openapi.json                 # Generated OpenAPI spec
├── tsconfig.json
└── package.json
```

## Installation

```bash
npm install
```

## Usage

### Generate OpenAPI Spec

```bash
npm run generate
```

### View with Swagger UI

```bash
npm run serve
```

Opens Swagger UI at `http://localhost:8080` with auto-reload on spec changes.

## Adding New Fleet API Routes

### Using Claude Code

Run the following command in Claude Code:

```
/add-fleet-route <Fleet API documentation URL>
```

Example:

```
/add-fleet-route https://fleetdm.com/docs/rest-api/rest-api#list-hosts
```

Claude will automatically:

1. Fetch the API documentation
2. Create the Zod schema in `src/schemas/`
3. Register the endpoint in `generate-openapi.ts`
4. Regenerate the OpenAPI spec

### Manual Process

1. **Create Zod schema** in `src/schemas/<resource>.ts`
2. **Register endpoint** in `src/generate-openapi.ts`
3. **Regenerate**: `npm run generate`

## License

MIT
