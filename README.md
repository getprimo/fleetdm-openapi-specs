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
   diff live vs committed,          re-infer from live and merge
   exit 1 on drift  ── CI gate      into the spec ── CI opens a PR on change
```

- **`src/validate/probes.ts`** — the manifest: the GET endpoints to cover. This
  is the single source of *structure* (paths, parameters, chaining).
- **`src/validate/infer.ts`** — turns a live response into a JSON Schema. Multiple
  samples are merged so optionality (`required` = present in every sample) and
  nullability are derived, not guessed. `mergeSchemas` also folds a fresh
  inference into the committed schema (union of properties, widened types).
- **`src/validate/run.ts`** — `validate` checks the live API against the committed
  spec (CI gate); `--write` re-infers from the live API and **merges** into
  `fleet-openapi.json`, and stamps the live Fleet version into `info`.
- **`fleet-openapi.json`** — the generated artifact. Every path in it has been
  verified against a live response. `--write` only **adds and widens** — it never
  drops an endpoint a single run couldn't reach, so the spec accumulates every
  shape seen across instances and time rather than mirroring one instance.

`info.version` carries the live Fleet version the spec was generated against,
with `x-fleet-revision` and `x-fleet-build-date` for full provenance.

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
  { specPath: '/api/v1/fleet/hosts', query: { per_page: 100 } },      // send a param
  { specPath: '/api/v1/fleet/hosts/identifier/{identifier}',          // fix chaining
    name: 'hosts-identifier-by-identifier', method: 'get',
    summary: 'Get host by identifier', tags: ['Hosts'],
    params: { identifier: { from: 'hosts', pick: 'hosts.*.uuid' } } },
];
```

Endpoints whose params the heuristic can't resolve, or that 404 / don't return
JSON, are skipped — the spec only ever contains what answered with a 200.

## Autonomy (CI)

Three workflows under `.github/workflows/`:

- **`discover.yml`** — weekly (+ manual): regenerates the probe list from Fleet's
  docs and opens a PR if the set of endpoints changed. Docs only, no secrets.
- **`sync.yml`** — weekly (+ manual): re-infers the spec from the live API and
  opens a PR if anything drifted.
- **`check.yml`** — on pull requests: fails if the live API no longer conforms to
  the committed spec (skips the bot's own branches).

Set `FLEET_URL` and `FLEET_TOKEN` as repository secrets (Settings → Secrets →
Actions). `discover` needs neither.

## Limitations & roadmap

- **GET-only.** Write endpoints are never exercised (read-only by design).
- **Sample-driven.** Conditionally populated fields and enums depend on what the
  live data exposes. Merging across runs mitigates this (each instance/window
  contributes the shapes it sees), but coverage is still only as wide as the data
  probed. Planned: a Claude enrichment pass to add field descriptions, detect
  enums, and recognise formats (UUID, email, …).
- **Append-only.** Because `--write` merges rather than replaces, a field that
  genuinely disappears from the API is not auto-removed — pruning a stale field is
  a manual edit (or a multi-instance confirmation, planned).
- The `check` gate does not run on the bot's own sync PR (GitHub blocks workflow
  runs on `GITHUB_TOKEN`-created PRs); gating everywhere needs a dedicated token.

## License

MIT
