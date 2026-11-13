# devhub-showcase

This repository hosts two Next.js apps that share one Supabase project and the same signed-in users.

- **MyDevStudio** (`apps/my-dev-studio`) is a multiuser portfolio and CV platform: public pages, a private editing studio, reusable sections, PDF generation, and optional AI features.
- **My Fitness Studio** (`apps/my-fitness-app`) is a fitness workspace: plans and tasks, Today and Week views, a public demo, optional workout and shopping drafts, and browser reminders.

[MyDevStudio](https://mydevstudio.vercel.app) · [My Fitness Studio](https://myfitnessstudio.vercel.app) · [Yusuf's portfolio](https://yusufdevhub.vercel.app) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## What it does

- Guided portfolio setup with optional CV import, one screen per section, and separate website and CV previews before saving a private draft.
- Publication controls for public, unlisted, password-protected and scheduled sharing, plus saved revision history.
- A signed-in profile menu, synced Studio appearance and companion preferences, and a companion feature guide.
- A private Job Hunter workspace for saved searches, CV matches, tailored application drafts and status tracking. Forwarded LinkedIn job alerts require an inbound email relay.
- Public username pages, themes, layouts and independent portfolio/PDF language settings.
- Reusable section renderers and editors, media sections and saved section templates.
- PDF CVs generated from saved profile content, with Classic, Editorial, Compact and two ATS-friendly formats.
- Administrator-managed portfolios with controlled ownership transfer.
- Saved public and owner AI knowledge inspection, optional CV extraction, and Pro visitor chat and private editing proposals. Pro checkout uses Stripe test mode.

My Fitness Studio, for a confirmed account:

- Plans, workouts, and task drill-down on Today, Week, and Tasks.
- A signed-out demo at `/preview`.
- Optional Fitness assistant drafts for plans, sets, task edits, and the weekly shopping list. Generating a draft does not change saved tasks until the owner reviews and saves it.
- Optional browser reminders. Delivery needs the documented web-push keys.

The bundled public content works without service credentials. Authentication, persistence, managed portfolios, fitness data, and AI integrations require their respective setup. See the feature guides below; historical deployment notes are not proof of current production configuration.

## Start locally

Use Node `>=24.15.0 <25` and `pnpm@11.25.0`, as declared in [package.json](package.json). Install that pnpm version using your Node tooling before continuing.

```sh
git clone https://github.com/yusufyilmz/devhub-showcase.git
cd devhub-showcase
pnpm install --frozen-lockfile
pnpm dev:setup
pnpm --filter my-dev-studio dev
pnpm --filter my-fitness-app dev
```

MyDevStudio serves <http://localhost:3001>. My Fitness Studio serves <http://localhost:3002>. `pnpm dev:setup` copies the safe root [.env.development](.env.development) defaults to `apps/my-dev-studio/.env.development.local` only when that file does not exist. Repeating the command preserves it byte-for-byte. Next.js loads environment files from the app directory; it does not load root environment files. Exported shell variables, `.env.development.local`, `.env.local`, `.env.development`, then `.env` take precedence in that order during development. Restart the server after edits.

Fitness uses its own ignored env file. Copy [apps/my-fitness-app/.env.example](apps/my-fitness-app/.env.example) to `apps/my-fitness-app/.env.local` and point it at the same Supabase project, including `http://localhost:3002/auth/callback` in that project's redirect URLs.

For optional integrations, consult [.env.example](.env.example) and add only the settings you need to the ignored app file. Never commit it. For local authentication, install Docker and the Supabase CLI, run `supabase start` from the repository root, then run `pnpm dev:setup --supabase` before creating the app environment file. This reads only the running local stack's URL and public key; it does not start containers, reset data, link a hosted project or create users. If the file already exists, edit its local Supabase settings manually. See [local login setup](/docs/dev-studio/google-login.md#local-testing-without-google-oauth) and the [manual setup checks](docs/testing/manual/local-development.md).

| Configuration                                                      | Purpose                                                        |
| ------------------------------------------------------------------ | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Authentication and profile storage; anon key remains supported |
| `NEXT_PUBLIC_SITE_URL`                                             | Canonical origin for links and metadata                        |
| `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, `OPENAI_MODEL`              | Portfolio chat and portfolio model configuration               |
| `REDIS_URL`, `REDIS_TOKEN`                                         | Required rate-limit storage for AI features                    |
| `OPENAI_CV_MODEL`, `CV_IMPORT_DAILY_LIMIT`                         | Optional CV extraction model and global import cap             |
| `APPLICATION_NAME`, `LOG_LEVEL`                                    | Existing Pino logging                                          |

Use [.env.example](.env.example) for current defaults. Do not expose OpenAI, Redis, deployment or service-role credentials through `NEXT_PUBLIC_` variables.

## Everyday commands

Shared workspace tooling lives in [`tools/cli`](tools/cli/README.md) (`@shared/cli`) and [`tools/test`](tools/test/README.md) (`@shared/test`), alongside the TypeScript configuration package. CLI tooling owns repository scripts, Turbo generators and tsdown defaults. Test tooling owns reusable fixtures, Storybook helpers, setup and framework mocks. See [tooling verification](docs/testing/manual/shared-tooling.md).

Run these from the repository root.

| Command                                    | Purpose                                                   |
| ------------------------------------------ | --------------------------------------------------------- |
| `pnpm dev`                                 | Start workspace development through Turborepo             |
| `pnpm --filter my-dev-studio dev`          | MyDevStudio on port 3001                                  |
| `pnpm --filter my-fitness-app dev`         | My Fitness Studio on port 3002                            |
| `pnpm check`                               | Link, catalog, export, lint, docs, skill, and type checks |
| `pnpm check:format` / `pnpm format`        | Check / write formatting                                  |
| `pnpm lint` / `pnpm lint:fix`              | Check / fix lint issues                                   |
| `pnpm test` / `pnpm test:watch`            | Unit tests / watch mode                                   |
| `pnpm test:fitness`                        | Fitness app unit tests                                    |
| `pnpm test:coverage`                       | V8 coverage for the configured source subset              |
| `pnpm build`                               | Full workspace production build                           |
| `pnpm build:studio` / `pnpm build:fitness` | Production build for one app                              |
| `pnpm test:e2e` / `pnpm test:e2e:fitness`  | Studio / Fitness Playwright suites                        |
| `pnpm test:e2e:report`                     | Open the Studio browser test report                       |
| `pnpm storybook`                           | Storybook for shared UI on port 6006                      |
| `pnpm cv:generate`                         | Generate a local PDF from a public profile                |

See [testing](docs/testing.md) for browser prerequisites and coverage limitations. Package-specific aliases may differ from root commands; root `format:check`, `lint:check` and `assist:check` are not the documented entry points.

## Architecture

Next.js App Router and React run in a pnpm/Turborepo workspace. TypeScript, Biome and Tailwind CSS support both apps. External dependency versions live in [pnpm-workspace.yaml](pnpm-workspace.yaml); internal dependencies use `workspace:*`.

| Location              | Responsibility                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| `apps/my-dev-studio`  | Portfolio routes, server adapters, metadata, and composition              |
| `apps/my-fitness-app` | Fitness routes, task workspace, demo, and notification delivery           |
| `apps/storybook-app`  | Storybook for shared UI                                                   |
| `packages/config`     | Profile types, themes, section metadata, and page copy                    |
| `packages/lib`        | Shared database access, repositories, validation, and Fitness persistence |
| `packages/auth`       | Shared sign-in used by both apps                                          |
| `packages/ui`         | Controls, layout, theme tokens, and global CSS                            |
| `packages/assistant`  | Studio, portfolio, and fitness assistant compositions, plus CV PDFs       |
| `packages/utils`      | Logging and generic utilities                                             |
| `supabase/migrations` | Reviewed schema and access-policy history                                 |

Supabase is the persistence integration for both apps. Prisma is not used. Install, check and build commands do not apply migrations. The published main profile, when configured, supplies the original portfolio content and chat context; bundled content supplies the supported fallback. Named private or missing profiles must never fall back to another person's data. A Fitness account is the same signed-in user, with its own plans and tasks.

## Documentation

See [docs/README.md](docs/README.md) for the full index, including [guided setup](docs/testing/manual/onboarding.md), [Job Hunter](docs/testing/manual/job-hunter.md), and [LinkedIn alert forwarding](docs/testing/manual/linkedin-job-alerts.md). Fitness guides start at [login compatibility](docs/testing/manual/fitness-login.md), [workspaces](docs/testing/manual/fitness-workspaces.md), [task plans](docs/testing/manual/fitness-task-plans.md), and the [assistant](docs/testing/manual/fitness-assistants.md).

### Hubs

| Guide                                  | Read it for                                                       |
| -------------------------------------- | ----------------------------------------------------------------- |
| [Features](docs/features.md)           | Current capabilities, user flows and limitations                  |
| [Architecture](docs/architecture.md)   | Package boundaries, data flow and trust boundaries                |
| [Contributing](CONTRIBUTING.md)        | Setup, development workflow and PR expectations                   |
| [Testing](docs/testing.md)             | Verification commands, coverage and debugging                     |
| [Observability](docs/observability.md) | Free logging baseline, Sentry adoption plan and incident response |
| [Conventions](docs/conventions.md)     | TypeScript, React, validation and dependency rules                |
| [Agent instructions](AGENTS.md)        | Working safely with coding agents                                 |

### Features

| Guide                                                                                                                                                                                                                           | Read it for                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Personal workspaces](docs/dev-studio/multiuser-cvs.md), [Google login](docs/dev-studio/google-login.md)                                                                                                                        | Authentication and profile setup                                       |
| [AI foundation](docs/dev-studio/portfolio-ai-foundation.md)                                                                                                                                                                     | Public/owner knowledge, saved AI profile inspector and chat boundaries |
| [Managed portfolios](docs/dev-studio/managed-portfolios.md), [CV import](docs/dev-studio/cv-import.md)                                                                                                                          | Administration, transfer and extraction                                |
| [Section system](docs/dev-studio/section-system.md), [section templates](docs/dev-studio/section-templates.md)                                                                                                                  | Section editing and composition                                        |
| [Premium access](docs/dev-studio/premium-access.md), [premium chat](docs/dev-studio/premium-portfolio-chat.md), [Stripe billing](docs/dev-studio/stripe-billing.md)                                                             | Entitlements, chat and test billing                                    |
| [Fitness login](docs/testing/manual/fitness-login.md), [workspaces](docs/testing/manual/fitness-workspaces.md), [task plans](docs/testing/manual/fitness-task-plans.md), [assistant](docs/testing/manual/fitness-assistants.md) | Plans, demo, reminders, and reviewed drafts                            |

### Reference

| Guide                                                                                                                    | Read it for                                |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| [Shared packages](docs/reference/shared-packages.md), [section migration](docs/reference/pageforge-section-migration.md) | Reuse boundaries and compatibility         |
| [Tailwind](docs/reference/tailwind.md)                                                                                   | Shared CSS pipeline and theme tokens       |
| [Portfolio table RLS review](docs/reference/portfolio-table-rls-review.md)                                               | Historical security findings to revalidate |

## CV generation

Public CV endpoints generate PDFs from published data. Private downloads require the authenticated studio. Edit `packages/assistant/templates/cv.json.hbs` for template changes; profile values are data, never executable template code.

```sh
pnpm cv:generate
# Public profile ID; main selects the original portfolio:
pnpm cv:generate --args output/my-cv.pdf main
```

The generator does not overwrite existing output. See [personal workspaces](/docs/dev-studio/multiuser-cvs.md) for public/private behavior and deployment prerequisites.

## CI and deployment

[CI / CD](.github/workflows/ci.yml) runs frozen installation, `pnpm check`, `pnpm test`, the Storybook build and `pnpm build` in the `Verify` job. [Browser tests](.github/workflows/e2e.yml) run separately only on pushes to the production branch, `main`. Their job is non-blocking and deployment does not depend on it. Browser reports are retained for seven days.

Production deployment runs after verification on non-PR pushes to `main`. Two jobs deploy in parallel: MyDevStudio (`VERCEL_PROJECT_ID`) and My Fitness Studio (`VERCEL_FITNESS_PROJECT_ID`), both using `VERCEL_TOKEN` and `VERCEL_ORG_ID`. Each job pulls production configuration, builds, and deploys prebuilt output. Application variables belong in deployment configuration. See `apps/my-dev-studio/vercel.json` and `apps/my-fitness-app/vercel.json`.

Require `Verify` before merging. If GitHub Actions is the intended sole release path, check the project's automatic Git deployment settings separately. A successful build does not confirm a deployment, migration or external provider setup.

## License

[MIT](LICENSE).
