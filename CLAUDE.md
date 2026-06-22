# Fleet OpenAPI Specs

A live-driven OpenAPI 3.1 spec for the Fleet REST API. The spec is generated
from real responses of a live Fleet instance — there are no hand-maintained
schemas. See `README.md` for the full vision.

## Commands

- `npm run discover` - Regenerate the probe list from Fleet's `rest-api.md` (docs only, no secrets)
- `npm run validate` - Check live API responses against the committed spec (exit 1 on drift)
- `npm run validate:write` - Regenerate `fleet-openapi.json` from the probes + live responses

`validate`/`validate:write` require `FLEET_URL` and `FLEET_TOKEN` (see `.env.example`); `discover` does not.

## Project Structure

- `src/validate/docs.ts` - Fetch + parse Fleet's `rest-api.md` (endpoint discovery, parameter tables)
- `src/validate/discover.ts` - Generate the probe list from the docs → `probes.generated.ts`
- `src/validate/probes.generated.ts` - AUTO-GENERATED probe list (do not hand-edit; run `npm run discover`)
- `src/validate/probes.ts` - Manual OVERRIDES + probe types (the only hand-maintained probe file)
- `src/validate/infer.ts` - JSON Schema inference from live responses (merges samples)
- `src/validate/run.ts` - Generator + checker (`--write` regenerates the spec)
- `fleet-openapi.json` - Generated spec artifact (only contains endpoints that answered 200)
- `.github/workflows/{discover,sync,check}.yml` - CI: discover + sync auto-PRs on schedule, gate on PRs

## Conventions

- Probes are **GET-only and read-only**. Never add write probes.
- Paths in the manifest are canonical (`/api/v1/...`); the runner rewrites the
  version segment to `FLEET_API_VERSION` for live calls.
- Never commit a Fleet instance URL or token; configuration is via env/secrets only.
