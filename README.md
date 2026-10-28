# Yusuf DevHub

Yusuf Yilmaz’s portfolio: [yusufdevhub.vercel.app](https://yusufdevhub.vercel.app). Built with Next.js App Router, React, TypeScript and a pnpm/Turborepo workspace. The existing navy/cyan design is preserved.

## Portfolio studio and refreshed themes

The `/admin` area now gives every confirmed user their own private CV, contact/career details, appearance and PDF preferences. Users can opt in to a public profile link. See [multiuser CV setup](docs/multiuser-cvs.md). The original portfolio and its AI context read the same saved main profile. Each additional public CV page reads only its own published row. Dark/light mode and three accent palettes share one theme system.

**Activation requires the profile migrations and Google provider setup.** See [multiuser setup](docs/multiuser-cvs.md). Only the original site portfolio needs a manual owner assignment; other accounts provision their CV automatically. The public profile retains a bundled fallback until storage is configured. The CV download is generated from the published profile, so it reflects saved edits automatically.

## Start locally

Use Node.js 24 (24.15 or newer) and the pnpm version in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. The public career, project and education sections work without credentials. Copy `.env.example` to `apps/web/.env.local` only if you need the optional integrations below. Keep secrets out of Git.

## Update the information

`packages/content/src/profile.ts` is the bundled fallback profile, updated from the October 2026 CV. Once the studio is activated, the published `portfolio_profiles` row is authoritative. It contains the biography, six employers, achievements, selected projects, education, languages, skills and contact links. Both the page and AI context derive from it, so they cannot silently retain separate career histories.

- `packages/lib/src/services/portfolio` maps the profile into typed page resources.
- `packages/chat/src/models/cv-model.ts` maps the same profile into the chat model. Missing durations, GPA values, references and personal traits are not invented.
- `/cv.pdf` generates a PDF from the published profile and `packages/cv/templates/cv.json.hbs`. There is no committed PDF to keep in sync.
- `packages/content/src/site-copy` holds labels, SEO metadata and structured data.

Professional case studies appear inside their employer’s experience card. The public project showcase includes DevHub and Fitness OS with live and GitHub links. Public career data starts from the versioned profile and can be published through the studio; old database experience/project rows do not override it. Existing database tables and records are not modified or deleted.

## Commands

| Command                                         | Purpose                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `pnpm dev`                                      | Run the Next.js development server through Turbo                      |
| `pnpm build`                                    | Check shared packages and build Next.js                               |
| `pnpm start`                                    | Serve the built web app                                               |
| `pnpm format` / `pnpm format:check`             | Format / verify with Biome                                            |
| `pnpm lint:check` / `pnpm lint:fix`             | Check / fix Biome lint rules                                          |
| `pnpm assist:check` / `pnpm assist`             | Check / apply import organization                                     |
| `pnpm check` / `pnpm check:fix`                 | Combined Biome checks / fixes                                         |
| `pnpm typecheck`                                | Check tests, tooling, every source package and the app in strict mode |
| `pnpm test` / `pnpm test:watch`                 | Run Vitest / watch tests                                              |
| `pnpm test:coverage`                            | Run Vitest with V8 coverage                                           |
| `pnpm clean`                                    | Remove local build output                                             |
| `pnpm create-package` / `pnpm create-component` | Use the updated Turbo generators                                      |

`pnpm types:check` remains an alias for compatibility. Packages use explicit `workspace:*` dependencies rather than relying on Yarn hoisting. Source packages are compiled by Next.js; their package build scripts run type checks instead of emitting unused JavaScript. Biome replaces ESLint and Prettier throughout the workspace. Generated SQL/database types and build outputs are excluded from formatting.

## App Router structure

```text
apps/web/
  app/                     App Router layout, pages, errors and server actions
  lib/portfolio-resources.ts  Public profile plus optional testimonials
  proxy.ts                 Optional Supabase session refresh (Next.js 16 convention)
  app/cv.pdf/route.ts      CV PDF download from published data
packages/
  content/                 Shared profile, labels and SEO
  ui/                      Existing components, styles, hooks and stores
  chat/                    Classification, CV context, formatting and OpenAI service
  cv/                      Shared Plop/Handlebars CV template and PDF renderer
  lib/                     Resource contracts, profile storage and Supabase services
  cache/                   Redis cache adapter
  log/                     Logging
  typescript-config/       Strict shared TypeScript configuration
  tailwind-config/         Existing Tailwind design tokens
supabase/                  Existing backend setup
tests/                    Content, adapter, UI and configuration tests
```

The application already used App Router. This update modernizes it to Next.js 16 with React 19, async request APIs and `proxy.ts`. No Pages Router routes are introduced. Secrets stay in server actions and server services; client components own browser interactions.

## Optional services

### Supabase referrals and reviews

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Existing `NEXT_PUBLIC_SUPABASE_ANON_KEY` deployments remain supported. Only publishable/anon keys belong in the browser. Do not expose a service-role key.

The public profile loads independently of Supabase. If configured, the homepage also reads testimonials and additional public project examples through the existing Supabase services. Versioned personal projects take priority over database entries with the same title. Private database projects are excluded. A failed testimonial query does not hide the portfolio. Referral submission and review moderation still depend on the existing schema and access policies. Configure authentication and row-level policies for your deployment before enabling moderation; this PR does not change database policies or grant new access.

### AI chat

Set `OPENAI_API_KEY`, `REDIS_URL` and `REDIS_TOKEN` on the server. The chat requires Redis for its existing rate limit. Without these values it returns the existing failure response instead of crashing the page build. `OPENAI_MODEL` defaults to `gpt-4.1-mini`; choose a Chat Completions model available to your account. No email or provider credentials are needed for the public portfolio.

### Database tooling

Supabase is the only database integration. Versioned SQL lives in `supabase/migrations`; database changes are applied intentionally through the Supabase migration process. Installing, checking or building the app does not generate an ORM client, connect to a database, or apply migrations. There is no ORM selector or direct database connection string in the app configuration.

## CI and deployment

`.github/workflows/ci.yml` is the single workflow. Every PR and push to `main` runs:

```text
format:check → lint:check → assist:check → test → typecheck → build
```

PR checks use no production credentials and do not deploy. Only a successful `main` push (or manual run on `main`) reaches the separate production deployment job. It pulls Vercel configuration, builds production output and deploys with `--prebuilt`. Actions and the Vercel CLI are pinned. Branch concurrency cancels outdated PR runs and serializes production work.

Configure these GitHub repository or `production` environment secrets directly in GitHub:

| Secret              | Source                                       |
| ------------------- | -------------------------------------------- |
| `VERCEL_TOKEN`      | A token authorized for the portfolio project |
| `VERCEL_ORG_ID`     | Your linked project’s `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your linked project’s `.vercel/project.json` |

Set the Vercel project’s Root Directory to `apps/web` and Node version to 24. `apps/web/vercel.json` installs the frozen workspace lockfile and builds from the repository root. Configure optional application variables in Vercel’s Production environment, not in the workflow YAML. Set the production environment’s deployment branch restriction to `main`; add reviewers if you want a manual release gate.

Require the `Verify` check before merging. If GitHub Actions should be the only production deployment path, disable automatic Vercel Git deployments for this project so they cannot bypass the checks. Keep the Vercel project and environment settings. No project or secret is created by this code change.

## Dependency policy and upgrades

Runtime/tool versions were checked against the package registry in October 2026 and are centralized in the `pnpm-workspace.yaml` catalog and recorded in `pnpm-lock.yaml`. This update moves off the Next.js 15 canary to Next.js 16.4.3, React 19.3.1, MUI 9.5.0, Supabase JS 2.118.0, Supabase SSR 0.12.7, OpenAI 7.45.1, Turbo 2.11.10, Biome 2.6.3 and Vitest 5.0.5.

TypeScript uses 7.0.2 across the workspace. Next.js runs its native compiler through `experimental.useTypeScriptCli`; server packages explicitly load Node globals with `types: ["node"]`. Tailwind stays on 3.4.19 and pnpm on 11.25.0. Tailwind 4 changes CSS/configuration. External packages use `catalog:` references; internal packages retain `workspace:*`. Dependabot checks npm dependencies and GitHub Actions weekly. Do not replace stable pins with a prerelease just because a registry tag points to one.

Review dependency release notes, update pins, regenerate the lockfile, and run all checks before merging an upgrade. `pnpm-workspace.yaml` explicitly allows only the required dependency build scripts.

## Validation

Vitest covers current career chronology, public/work project placement, shared AI context, date formatting, missing configuration, and rendered project links. The production build must work without Supabase, OpenAI or database credentials. Live database operations and AI responses additionally require configured services.

## License

MIT. See [LICENSE](LICENSE).

## Generating the CV

The public `/cv.pdf` endpoint reads the published profile on each request and returns a downloadable PDF. Keep the admin CV link set to `/cv.pdf` for automatic updates. An external URL remains an optional override. The document contains profile/contact details, summary, skills, experience, public projects, education and languages. Nonpublic projects are omitted from the project list. Page breaks, Unicode fonts and page numbers are handled by the shared renderer without Chromium or an external rendering service.

Edit `packages/cv/templates/cv.json.hbs` to change the document layout. It is a JSON document definition rendered through Handlebars, the same template engine used by Plop. Use `{{{json value}}}` for profile values to preserve quotes and newlines safely. Content is plain text, never template code.

Generate a local copy with the existing Turbo/Plop runner. Choose a public profile ID; `main` selects the original site portfolio. Private CVs are downloaded through the signed-in studio:

```sh
pnpm cv:generate
# Or supply an output path without a prompt:
pnpm cv:generate --args output/my-cv.pdf main
```

The generator loads `apps/web/.env.local`, then root `.env.local`, while preserving existing environment values. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the existing anon key) to read the published `portfolio_profiles` row. No service-role key is used. With no database configuration, local generation clearly reports that it uses the bundled development profile. With database configuration present, a failed read stops generation. The public endpoint follows the website’s bundled-profile fallback until storage is configured or when storage is unavailable; `X-Profile-Revision: 0` identifies fallback output. It returns 503 if PDF generation itself fails. Both paths use the same template and public-profile reader. Generated PDFs go to ignored `output/` and existing files are never overwritten by the generator.

Development uses Webpack, as does the production build, to load the `.hbs` file as source text. The template and bundled fonts ship with the server, so deployments need no filesystem write access and no build-time database connection.
