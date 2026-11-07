# Working on MyDevStudio

MyDevStudio is a multiuser portfolio and CV platform in the `devhub-showcase` repository. These instructions apply throughout the repository. Read the files you are changing before editing them, and preserve unrelated work.

## Confirm the checkout

The user's primary local checkout is `/Users/yusufyilmaz/code/freelance/projects/devhub-showcase-1`. Before editing, verify `pwd`, `git rev-parse --show-toplevel`, and `git status --short`. Use this checkout unless the user explicitly selects another checkout or worktree. A ChatGPT project mirror or another folder named `devhub-showcase` is not interchangeable with it.

Preserve existing staged and unstaged work. Apply only the requested changes; do not copy whole files from another checkout without comparing them. Do not stage, commit, or publish changes unless requested. Report verification from the checkout where it actually ran.

## Apps and packages

Workspace members are `apps/*`, `packages/*`, and `tools/*`. The Next.js app package name is `my-dev-studio`. Shared packages use the `@shared/*` name. There is no `apps/web` package.

| Location                 | Name                    | Responsibility                                                                  |
| ------------------------ | ----------------------- | ------------------------------------------------------------------------------- |
| `apps/my-dev-studio`     | `my-dev-studio`         | Next.js routes, API handlers, and feature data access                           |
| `apps/my-fitness-app`    | `my-fitness-app`        | Fitness OS app. Task rows share the Supabase project and Auth users             |
| `apps/storybook-app`     | `storybook-app`         | Storybook for `packages/ui`                                                     |
| `packages/ui`            | `@shared/ui`            | Controls, sections, studio and portfolio surfaces, theme, and global CSS        |
| `packages/config`        | `@shared/config`        | Profile types, themes, section metadata, and page copy including the home FAQ   |
| `packages/lib`           | `@shared/lib`           | Validation, schemas, Supabase helpers, and shared types                         |
| `packages/services`      | `@shared/services`      | Domain services and repositories (studio profile, portfolio, fitness workspace) |
| `packages/auth`          | `@shared/auth`          | Session helpers and Google sign-in                                              |
| `packages/templates`     | `@shared/templates`     | CV PDF rendering                                                                |
| `packages/notifications` | `@shared/notifications` | Web push delivery and notification helpers                                      |
| `packages/assistant`     | `@shared/assistant`     | Portfolio and editing assistants                                                |
| `packages/cache`         | `@shared/cache`         | Cache integrations                                                              |
| `packages/runtime`       | `@shared/runtime`       | Shared runtime helpers, including notifications                                 |
| `packages/utils`         | `@shared/utils`         | Logging and other shared utilities                                              |
| `packages/trello`        | `@shared/trello`        | Trello board UI                                                                 |

App routes stay in `apps/my-dev-studio/app`. App-only data access stays in `apps/my-dev-studio/features/<feature>`. That app has no `lib` folder.

| Feature      | Owns                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| `admin`      | Workspace auth, session handlers, Google profile import, owner edit link        |
| `billing`    | Stripe gateway, billing client, pricing, premium configuration, account status  |
| `chat`       | Visitor chat and legacy portfolio chat access                                   |
| `home`       | Home session links                                                              |
| `management` | Managed portfolios and their API helpers                                        |
| `platform`   | Site URL, platform metadata, page presentation, document request client         |
| `portfolio`  | Published and public profiles, metadata, branding, CV responses, page resources |

Import portable UI from `@shared/ui`. Do not add a feature file that only re-exports a shared component. Do not move auth, database access, or route handlers into `packages/ui`. Pass fetching and navigation in from the app.

## Lib and services

`@shared/services` owns service and repository implementations, grouped by domain under `packages/services/src` (for example `profile/`, `portfolio/`, `fitness/`). See [packages/services/CATALOG.md](packages/services/CATALOG.md).

`@shared/lib` owns validators, profile and section domain modules, Supabase client helpers, and shared database or chat types. See [packages/lib/CATALOG.md](packages/lib/CATALOG.md).

Do not add a file in one package that only re-exports another package’s implementation, especially through relative paths into a sibling folder (for example `packages/lib/src/repositories/profile-repository.ts` that contains `export * from "../../../services/src/..."`). That creates a hidden dependency, breaks package boundaries, and invites cyclic workspace deps. Import the owning package export instead (`@shared/services/profile`, `@shared/services/profile-repository`, and so on). When code moves from lib to services, update `package.json` exports and call sites in the same change; do not leave compatibility shims in lib.

### Package export paths

In each workspace package’s `package.json` `exports`, prefer shallow public entry points. Use at most **two** path segments after the package name:

- One segment: `@shared/lib/types`, `@shared/services/profile`, `@shared/services/fitness`
- Two segments: `@shared/services/fitness/workspace`, `@shared/services/db/client` (with `./db/*` mapping to files under `src/fitness/db/`)

Do **not** add deep export keys or tsconfig path aliases such as `@shared/lib/types/supabase/database.types` or `@shared/services/fitness/task/service/task-service`. Put modules behind a domain barrel (`src/fitness/task/index.ts` exported as `./fitness/task`) or the package root barrel (`./types`, `./fitness`). Import `Database`, `Json`, and row types from `@shared/lib/types`, not from generated file paths.

## Reuse shared UI

Always build interface from `packages/ui`. Check [packages/ui/CATALOG.md](packages/ui/CATALOG.md) before writing markup. Controls, sections, layout, chat, studio screens, portfolio surfaces, and global CSS all live there. Import a control as `@shared/ui/{folder}`.

Do not create one-off components from plain HTML elements in app routes, features, or other packages. Homepage blocks live in `packages/ui/src/sections/home-section` and compose the shared controls.

If the catalog has no component that fits, add it in `packages/ui`. The UI catalog is generated: update `packages/ui/src/registry/components.json` and/or `packages/ui/catalog.template.md`, then run `pnpm generate:ui-catalog`. Do not hand-edit `packages/ui/CATALOG.md`; verify with `pnpm check:ui-catalog`.

## Where code goes

Follow the first matching question. Stop at the first yes.

```mermaid
flowchart TD
  start[What are you changing?]
  start --> route{Does a URL, metadata, or HTTP handler need to exist?}
  route -->|Yes| app["apps/my-dev-studio/app"]
  route -->|No| access{Does it authorize, read a database, call Stripe, or know an API URL?}
  access -->|Yes| feature["apps/my-dev-studio/features"]
  access -->|No| visual{Is it a reusable visual component, stylesheet, or token?}
  visual -->|Yes| ui["packages/ui"]
  visual -->|No| kind{What kind of shared code is it?}
  kind -->|Page copy| contentPkg["packages/config"]
  kind -->|Profile shape, theme, or section metadata| config["packages/config"]
  kind -->|Validation, repository, or Supabase| lib["packages/lib"]
  kind -->|Domain service or repository impl| servicesPkg["packages/services"]
  kind -->|Sign-in or session helper| auth["packages/auth"]
  kind -->|CV PDF| cv["packages/templates"]
  kind -->|Assistant model| assistant["packages/assistant"]
  kind -->|Trello board| trello["packages/trello"]
  kind -->|Log or generic helper| utils["packages/utils"]
  kind -->|Story for an existing component| story["Colocate the story with that component"]
```

When the answer is `features/`, pick the folder by subject:

```mermaid
flowchart TD
  feature[Which feature?]
  feature --> admin{Sign-in, session, Google import, or owner edit link?}
  admin -->|Yes| adminDir["features/admin"]
  admin -->|No| billing{Stripe, price, plan, or premium setup?}
  billing -->|Yes| billingDir["features/billing"]
  billing -->|No| chat{Visitor chat or legacy chat access?}
  chat -->|Yes| chatDir["features/chat"]
  chat -->|No| home{Homepage session link?}
  home -->|Yes| homeDir["features/home"]
  home -->|No| managed{Managed portfolio or transfer?}
  managed -->|Yes| managedDir["features/management"]
  managed -->|No| platform{Site URL, platform metadata, or document shell data?}
  platform -->|Yes| platformDir["features/platform"]
  platform -->|No| portfolioDir["features/portfolio"]
```

A component that needs data receives that data, or a request function, from the feature. The component does not choose the API URL. A route file stays thin and calls the feature.

## Dev environment

Use the Node and pnpm versions in the root `package.json` (currently Node 24.15+ below 25, and pnpm 11). Check the active versions before installing or running checks. Install with `pnpm install --frozen-lockfile`. External dependencies use `catalog:`. Internal dependencies use `workspace:*`. Change the catalog, the package manifest, and the lockfile together.

- Studio dev server: `pnpm --filter my-dev-studio dev` (port 3001)
- Fitness dev server: `pnpm --filter my-fitness-app dev` (port 3002)
- Targeted builds: `pnpm build:studio` and `pnpm build:fitness`
- One package: `pnpm --filter <package-name> <script>`
- Storybook: `pnpm --filter storybook-app storybook`
- Clear the Storybook optimizer cache: `pnpm --filter storybook-app storybook:clean`
- Stop Storybook: `pnpm --filter storybook-app storybook:kill`
- Workspace check: `node .agents/skills/mydevstudio-development/scripts/check-workspace.mjs`

Lint and format with Biome. Do not add ESLint. Do not relax Biome or TypeScript rules to get a green check. Do not hand-edit generated Next.js files.

Read the matching skill before a large change:

- [Development](.agents/skills/mydevstudio-development/SKILL.md)
- [Business rules](.agents/skills/mydevstudio-business/SKILL.md)
- [Sections](.agents/skills/mydevstudio-sections/SKILL.md)

When the change is inside one package or app, also read that package skill:

| Area                 | Skill                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `packages/ui`        | [Developing the UI package](.agents/skills/developing-ui-package/SKILL.md)               |
| `packages/config`    | [Developing the config package](.agents/skills/developing-config-package/SKILL.md)       |
| `packages/lib`       | [Developing the lib package](.agents/skills/developing-lib-package/SKILL.md)             |
| `packages/auth`      | [Developing the auth package](.agents/skills/developing-auth-package/SKILL.md)           |
| `packages/templates` | [Developing the CV package](.agents/skills/developing-cv-package/SKILL.md)               |
| `packages/assistant` | [Developing the assistant package](.agents/skills/developing-assistant-package/SKILL.md) |
| `packages/cache`     | [Developing the cache package](.agents/skills/developing-cache-package/SKILL.md)         |
| `packages/runtime`   | [Developing the runtime package](.agents/skills/developing-runtime-package/SKILL.md)     |
| `packages/utils`     | [Developing the utils package](.agents/skills/developing-utils-package/SKILL.md)         |
| `packages/trello`    | [Developing the Trello package](.agents/skills/developing-trello-package/SKILL.md)       |
| `apps/my-dev-studio` | [Developing the MyDevStudio app](.agents/skills/developing-my-dev-studio-app/SKILL.md)   |
| `apps/storybook-app` | [Developing the Storybook app](.agents/skills/developing-storybook-app/SKILL.md)         |

Use [features](docs/features.md), [architecture](docs/architecture.md), [conventions](docs/conventions.md), [testing](docs/testing.md), and [DESIGN.md](DESIGN.md). Check the matching catalog before adding a public export:

| Package     | Catalog                                                        | Check it before adding                      |
| ----------- | -------------------------------------------------------------- | ------------------------------------------- |
| `ui`        | [packages/ui/CATALOG.md](packages/ui/CATALOG.md)               | A control, section, surface, or stylesheet  |
| `config`    | [packages/config/CATALOG.md](packages/config/CATALOG.md)       | A profile field, theme, or section metadata |
| `lib`       | [packages/lib/CATALOG.md](packages/lib/CATALOG.md)             | Validation, a schema, or a Supabase helper  |
| `services`  | [packages/services/CATALOG.md](packages/services/CATALOG.md)   | A domain service or repository              |
| `auth`      | [packages/auth/CATALOG.md](packages/auth/CATALOG.md)           | A sign-in or session helper                 |
| `cv`        | [packages/templates/CATALOG.md](packages/templates/CATALOG.md) | CV PDF rendering                            |
| `assistant` | [packages/assistant/CATALOG.md](packages/assistant/CATALOG.md) | An assistant model or message               |
| `cache`     | [packages/cache/CATALOG.md](packages/cache/CATALOG.md)         | A cache client or rate limit                |
| `runtime`   | [packages/runtime/CATALOG.md](packages/runtime/CATALOG.md)     | A shared browser or fetch helper            |
| `utils`     | [packages/utils/CATALOG.md](packages/utils/CATALOG.md)         | A logger or generic helper                  |
| `trello`    | [packages/trello/CATALOG.md](packages/trello/CATALOG.md)       | Trello board UI or a Trello client          |

## Environment configuration

Each app owns a T3/Zod module: `apps/my-dev-studio/env.ts` and `apps/my-fitness-app/env.ts`. Import the matching module in app runtime code instead of reading `process.env` directly. Use relative imports unless the app's TypeScript configuration explicitly supports the alias.

Add settings to the appropriate `server` or `client` schema and the app's `.env.example` together. Public settings also need explicit `process.env.NEXT_PUBLIC_*` entries in `experimental__runtimeEnv` so Next.js can bundle them. Only intentionally public values belong in `client`; credentials stay in `server`.

Copy examples into each app's `.env.local` for local credentials. Never overwrite existing local env files or copy real credentials into examples, logs, or documentation. Next.js loads env files; standalone scripts must load their environment explicitly.

Optional integrations remain optional. Empty strings normalize to `undefined`; flags and numeric limits remain strings. Preserve feature availability checks and existing fallback values. Validation occurs when the module is imported; do not claim explicit build-time validation unless it is wired into the build configuration.

Shared packages must not import either app's env module. Existing package-level env access and standalone tooling have separate lifecycles; migrate them deliberately through package-owned schemas or injected configuration. Tests that vary configuration should mock the app env boundary; keep schema validation tests against the real module. See [environment module verification](docs/testing/manual/environment-modules.md).

## Storybook deployment

Use `pnpm --filter storybook-app build-storybook`; the static output is `apps/storybook-app/storybook-static`. The separate [Pages workflow](.github/workflows/deploy-storybook.yml) builds and deploys on matching pushes to `main` or a manual run from `main`. Pages must use GitHub Actions as its publishing source. Keep deployed stories based on fictional fixtures; do not include production credentials or private data. When changing asset paths, verify both the Storybook manager and iframe under the repository subpath.

## Data and security

Keep authorization on the server. A client-supplied id, username, or profile field is not authority. Keep each owner's records isolated. A missing or private profile must not fall back to someone else's content. Respect revision conflicts.

Update types, validators, save and import boundaries, and rendering together when a persisted field changes. Keep compatibility for documents that omit the field.

Do not publish profiles, transfer ownership, assign roles, run production migrations, or change production data as a side effect of code work. Do not commit credentials or private exports. Do not log CV content, prompts, tokens, or raw request bodies. See [SECURITY.md](SECURITY.md).

## Testing

CI is [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It verifies code checks, unit tests, Storybook and production builds. The separate [browser workflow](.github/workflows/e2e.yml) runs only on pushes to `main` and does not block deployment.

Put each unit test next to the file it covers, with the same base name: `admin-login.tsx` and `admin-login.test.tsx` live in the same folder. A Storybook story for that component is `admin-login.stories.tsx` in that folder too. The same naming applies to modules (`user-profile.ts` and `user-profile.test.ts`) and route handlers (`route.ts` and `route.test.ts`).

Unit tests start with `describe`. Keep `beforeEach`, `afterEach`, and `it` inside that suite. Helpers that are not tests stay at module scope.

- Full local gate: `pnpm check` and `pnpm test`
- App types: `pnpm --filter my-dev-studio typecheck` and `pnpm --filter my-fitness-app typecheck`
- One file: `pnpm exec vitest run --project unit packages/ui/src/theme/ThemeProvider.test.tsx`
- Studio browser tests: `pnpm test:e2e:studio`
- Fitness browser tests: `pnpm test:e2e:fitness`
- Install browser dependencies first with `pnpm exec playwright install chromium`. Browser suites live in `apps/my-dev-studio/e2e` and `apps/my-fitness-app/e2e`.

Browser tests use local fixtures, not production accounts. If a required check cannot run, say what blocked it. Do not invent test output.

### Required manual feature documentation

For every new or changed feature, add or update a dedicated guide under [`docs/testing/manual/`](docs/testing/manual/index.md) and its entry in the [manual testing index](docs/testing/manual/index.md), in the same PR as the feature. This applies to UI, API, permission, integration and workflow behavior. Do not consider a feature ready for review without this documentation.

Use the [guide template](docs/testing/manual/template.md). Each feature guide must identify scope/status, account/fixture/configuration prerequisites and numbered steps. **Every step must contain a clickable full URL, the matching route path, the exact action/control, expected result and actual result/evidence.** Tabs use the real parent page route; never invent routes for tabs. Include persistence, failure/retry/conflict and owner/other-user/signed-out or public/private checks where applicable.

When a roadmap task has a reviewable implementation, add or update its Notion **How to test** section using the dedicated guide: clickable URLs, route paths, prerequisites, actions, expected results, actual evidence and PR/guide links. Preserve task requirements and do not mark deployed verification complete from local tests. If Notion access or workspace limits block the update, record the pending task links and do not repeatedly retry an entitlement failure.

Use disposable accounts and fictional content. Distinguish preview/local/manual/provider/deployed verification; leave unexecuted steps **Not run** and mark blocked prerequisites explicitly. Partial features must state what is unfinished. Never claim live integration or production migration verification from fixtures or a green CI run. Link each feature guide in the PR's per-feature testing section and maintain older instructions when behavior changes.

## Pull requests

Keep the change focused. Review the diff for unrelated files and secrets. Update docs when a command, package boundary, or user-facing behavior changes.

Run `pnpm check` and `pnpm test` before opening the PR. For app UI or route changes, also run `pnpm --filter my-dev-studio build` when the change can affect the production build. Say which checks actually ran.
