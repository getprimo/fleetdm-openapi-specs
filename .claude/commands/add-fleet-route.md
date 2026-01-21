# Add Fleet API Route

Add a new Fleet REST API endpoint to the OpenAPI specification.

## Input

$ARGUMENTS - The Fleet API documentation URL
The file with the specs is available at : @rest-api.md

## Instructions

1. **Fetch the documentation** from the provided URL using WebFetch
2. **Extract endpoint details**:
   - HTTP method (GET, POST, PUT, DELETE, PATCH)
   - Path (e.g., `/api/v1/fleet/hosts`)
   - Query parameters with types and descriptions
   - Request body schema (if applicable)
   - Response schema with all fields
   - Description and summary

3. **Create or update the Zod schema** in `src/schemas/`:
   - Use the resource name as filename (e.g., `host.ts` for hosts endpoints)
   - Follow the pattern in `src/schemas/activity.ts`
   - Add `.openapi()` metadata to all schemas
   - Export TypeScript types using `z.infer<>`

4. **Register the endpoint** in `src/generate-openapi.ts`:
   - Import the schemas
   - Use `registry.registerPath()` to add the endpoint
   - Include proper tags, security, and responses

5. **Regenerate the spec**: Run `npm run generate`

6. **Verify**: Check the output shows the new endpoint

## Schema Template

```typescript
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ResourceSchema = z
  .object({
    id: z.number().int().openapi({ description: "Unique identifier" }),
    // ... fields from documentation
  })
  .openapi("Resource");

export const ListResourceQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .optional()
      .openapi({ description: "Page number" }),
    per_page: z.coerce
      .number()
      .int()
      .optional()
      .openapi({ description: "Results per page" }),
    // ... query params from documentation
  })
  .openapi("ListResourceQuery");

export const ListResourceResponseSchema = z
  .object({
    resources: z.array(ResourceSchema),
    meta: z.object({
      has_next_results: z.boolean(),
      has_previous_results: z.boolean(),
    }),
  })
  .openapi("ListResourceResponse");

export type Resource = z.infer<typeof ResourceSchema>;
```

## Endpoint Registration Template

```typescript
registry.registerPath({
  method: "get",
  path: "/api/v1/fleet/resources",
  summary: "List resources",
  description: "Description from documentation",
  tags: ["Resources"],
  security: [{ BearerAuth: [] }],
  request: {
    query: ListResourceQuerySchema,
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: ListResourceResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});
```
