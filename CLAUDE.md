# Fleet OpenAPI Specs

A live-driven OpenAPI 3.1 spec for the Fleet REST API. The spec is generated
from real responses of a live Fleet instance — there are no hand-maintained
schemas. See `README.md` for the full vision.

## Commands

- `npm run validate` - Check live API responses against the committed spec (exit 1 on drift)
- `npm run validate:write` - Regenerate `fleet-openapi.json` from the manifest + live responses

Both require `FLEET_URL` and `FLEET_TOKEN` (see `.env.example`).

## Project Structure

- `src/validate/probes.ts` - The manifest: GET endpoints to cover (source of structure)
- `src/validate/infer.ts` - JSON Schema inference from live responses (merges samples)
- `src/validate/run.ts` - Generator + checker (`--write` regenerates the spec)
- `fleet-openapi.json` - Generated spec artifact (starts empty, grows as probes are added)
- `.github/workflows/spec-autonomy.yml` - CI: gate on PRs, sync + auto-PR on schedule

## Conventions

- Probes are **GET-only and read-only**. Never add write probes.
- Paths in the manifest are canonical (`/api/v1/...`); the runner rewrites the
  version segment to `FLEET_API_VERSION` for live calls.
- Never commit a Fleet instance URL or token; configuration is via env/secrets only.
