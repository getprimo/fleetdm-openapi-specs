# Fleet OpenAPI Spec — live-driven

An OpenAPI 3.1 spec for the [Fleet](https://fleetdm.com) REST API that stays
honest by being **generated from real responses of a live Fleet instance** —
not hand-maintained.

Fleet does not publish an OpenAPI spec, and hand-writing one drifts the moment
the API changes. Instead, this repo keeps a small **manifest of endpoints** and
a **CI loop** that calls a live Fleet instance, infers each response schema, and
opens a pull request whenever the committed spec no longer matches reality.

## How it works

```
                 ┌──────────────┐
  probes.ts ───▶ │   run.ts     │ ──▶ fetch live Fleet API (GET, read-only)
 (the manifest)  │  generate /  │ ──▶ infer JSON Schema from the response
                 │   check      │ ──▶ assemble fleet-openapi.json
                 └──────────────┘
                        │
        ┌───────────────┴────────────────┐
   validate (check)                 validate:write
   diff live vs committed,          regenerate the spec from
   exit 1 on drift  ── CI gate      live  ── CI opens a PR on change
```

- **`src/validate/probes.ts`** — the manifest: the GET endpoints to cover. This
  is the single source of *structure* (paths, parameters, chaining).
- **`src/validate/infer.ts`** — turns a live response into a JSON Schema. Multiple
  samples are merged so optionality (`required` = present in every sample) and
  nullability are derived, not guessed.
- **`src/validate/run.ts`** — `validate` checks the live API against the committed
  spec (CI gate); `--write` regenerates `fleet-openapi.json` from the manifest +
  live shapes.
- **`fleet-openapi.json`** — the generated artifact. Starts empty; every path in
  it has been verified against a live response.

Path parameters are resolved by **chaining**: to probe `/hosts/{id}`, the runner
first calls `/hosts`, picks a real `id`, then calls the detail endpoint.

## Configuration

The harness needs a live Fleet instance and a read-only API token, via env
vars (locally) or repository secrets (CI):

| Variable            | Required | Description                                            |
| ------------------- | -------- | ------------------------------------------------------ |
| `FLEET_URL`         | yes      | Base URL of the Fleet instance, e.g. `https://fleet.example.com` |
| `FLEET_TOKEN`       | yes      | Fleet API token (My Account → Get API token)           |
| `FLEET_API_VERSION` | no       | API version segment, defaults to `latest`              |

Copy `.env.example` to `.env` for local runs.

## Usage

```bash
npm install
npm run discover          # regenerate the probe list from Fleet's docs
npm run validate          # check live responses against the committed spec
npm run validate:write    # regenerate fleet-openapi.json from live
```

## How endpoints are added

The probe list is **discovered automatically**. `npm run discover` parses every
`GET` endpoint out of Fleet's `rest-api.md`, derives path-parameter chaining by a
heuristic (a `{p}` is sourced from the collection ending just before its segment,
`<collection>.*.<field>`), and writes the result to
`src/validate/probes.generated.ts` (committed, so the list is reviewable in PRs).

`src/validate/probes.ts` holds only manual **overrides** — query params to send,
chaining the heuristic gets wrong, and endpoints to add or drop:

```ts
export const OVERRIDES: ProbeOverride[] = [
  { specPath: '/api/v1/fleet/hosts', query: { per_page: 5 } },        // send a param
  { specPath: '/api/v1/fleet/hosts/identifier/{identifier}',          // fix chaining
    name: 'hosts-identifier-by-identifier', method: 'get',
    summary: 'Get host by identifier', tags: ['Hosts'],
    params: { identifier: { from: 'hosts', pick: 'hosts.*.uuid' } } },
];
```

Endpoints whose params the heuristic can't resolve, or that 404 / don't return
JSON, are skipped — the spec only ever contains what answered with a 200.

## Autonomy (CI)

`.github/workflows/spec-autonomy.yml`:

- **`check`** — on pull requests, fails if the live API has drifted from the
  committed spec.
- **`sync`** — on a weekly schedule (and manual dispatch), regenerates the spec
  from live and opens a PR if anything changed.

Set `FLEET_URL` and `FLEET_TOKEN` as repository secrets (Settings → Secrets →
Actions).

## Limitations & roadmap

- **GET-only.** Write endpoints are never exercised (read-only by design).
- **Sample-driven.** Conditionally populated fields and enums depend on what the
  live data exposes. Planned: a Claude enrichment pass to add field descriptions,
  detect enums, and recognise formats (UUID, email, …).
- The `check` gate does not run on the bot's own sync PR (GitHub blocks workflow
  runs on `GITHUB_TOKEN`-created PRs); gating everywhere needs a dedicated token.

## License

MIT
