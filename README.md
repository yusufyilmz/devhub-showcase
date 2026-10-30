# MyDevStudio

MyDevStudio is a multiuser portfolio and CV platform, developed in the `devhub-showcase` repository. It combines public portfolio pages, a private editing studio, reusable sections, PDF generation and optional AI features.

[Live site](https://mydevstudio.vercel.app) · [Yusuf's portfolio](https://yusufdevhub.vercel.app) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## What it does

- Personal workspaces with private saves and explicit public sharing.
- Public username pages, themes, layouts and independent portfolio/PDF language settings.
- Reusable section renderers and editors, media sections and saved section templates.
- PDF CVs generated from profile content rather than a separately maintained document.
- Administrator-managed portfolios with controlled ownership transfer.
- Saved public/owner AI knowledge inspection, main-portfolio AI chat and optional CV extraction.
- Server-side AI credentials and Redis limits; premium multiuser chat and billing remain separate rollout steps.

The bundled public content works without service credentials. Authentication, persistence, managed portfolios and AI integrations require their respective setup. See the feature guides below; historical deployment notes are not proof of current production configuration.

## Start locally

Use Node `>=24.15.0 <25` and `pnpm@11.25.0`, as declared in [package.json](package.json). Install that pnpm version using your Node tooling before continuing.

```sh
git clone https://github.com/yusufyilmz/devhub-showcase.git
cd devhub-showcase
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. For optional integrations, copy [.env.example](.env.example) to `apps/web/.env.local` and supply only the services you need. Never commit the resulting file.

| Configuration | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Authentication and profile storage; legacy anon key remains supported |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for links and metadata |
| `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, `OPENAI_MODEL` | Portfolio chat and legacy model configuration |
| `REDIS_URL`, `REDIS_TOKEN` | Required rate-limit storage for AI features |
| `OPENAI_CV_MODEL`, `CV_IMPORT_DAILY_LIMIT` | Optional CV extraction model and global import cap |
| `APPLICATION_NAME`, `LOG_LEVEL` | Existing Pino logging |

Use [.env.example](.env.example) for current defaults. Do not expose OpenAI, Redis, deployment or service-role credentials through `NEXT_PUBLIC_` variables.

## Everyday commands

Run these from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start development through Turborepo |
| `pnpm check` | Biome checks, complexity checks and TypeScript |
| `pnpm check:format` / `pnpm format` | Check / write formatting |
| `pnpm lint` / `pnpm lint:fix` | Check / fix lint issues |
| `pnpm check:assist` / `pnpm assist` | Check / apply configured import assistance |
| `pnpm test` / `pnpm test:watch` | Vitest run / watch mode |
| `pnpm test:coverage` | V8 coverage for the configured source subset |
| `pnpm build` | Full workspace production build |
| `pnpm start` | Serve the built web app |
| `pnpm test:e2e` | Playwright against production output and local fixtures |
| `pnpm test:e2e:report` | Open the browser test report |
| `pnpm cv:generate` | Generate a local PDF from a public profile |

See [testing](docs/testing.md) for browser prerequisites and coverage limitations. Package-specific aliases may differ from root commands; root `format:check`, `lint:check` and `assist:check` are not the documented entry points.

## Architecture

Next.js App Router and React run in a pnpm/Turborepo workspace. TypeScript, Biome, Tailwind CSS and MUI support the application. External dependency versions live in [pnpm-workspace.yaml](pnpm-workspace.yaml); internal dependencies use `workspace:*`.

| Location | Responsibility |
| --- | --- |
| `apps/web` | Routes, server adapters, metadata and application composition |
| `packages/content` | Domain content, profile types, themes and section metadata |
| `packages/lib` | Validation, services, repositories and persistence |
| `packages/auth` | Shared authentication integration |
| `packages/components`, `packages/sections` | Portable UI and section renderer/editor pairs |
| `packages/ui` | Existing portfolio presentation and adapters |
| `packages/cv`, `packages/chat` | PDF generation and AI chat |
| `packages/cache`, `packages/log` | Redis adapter and logging |
| `supabase/migrations` | Reviewed schema and access-policy history |
| `tests`, `e2e` | Vitest and Playwright suites |

Supabase is the persistence integration. Prisma is not used. Install, check and build commands do not apply migrations. The published main profile, when configured, supplies the original portfolio content and chat context; bundled content supplies the supported fallback. Named private or missing profiles must never fall back to another person's data.

## Documentation

| Guide | Read it for |
| --- | --- |
| [Architecture](docs/architecture.md) | Package boundaries, data flow and trust boundaries |
| [Contributing](CONTRIBUTING.md) | Setup, development workflow and PR expectations |
| [Testing](docs/testing.md) | Verification commands, coverage and debugging |
| [Observability](docs/observability.md) | Free logging baseline, Sentry adoption plan and incident response |
| [Conventions](docs/conventions.md) | TypeScript, React, validation and dependency rules |
| [Agent instructions](AGENTS.md) | Working safely with coding agents |
| [Personal workspaces](docs/multiuser-cvs.md), [Google login](docs/google-login.md), [admin setup](docs/admin-setup.md) | Authentication and profile setup |
| [AI foundation](docs/portfolio-ai-foundation.md) | Public/owner knowledge, saved AI profile inspector and chat boundaries |
| [Managed portfolios](docs/managed-portfolios.md), [CV import](docs/cv-import.md) | Administration, transfer and extraction |
| [Section system](docs/section-system.md), [section templates](docs/section-templates.md), [section order](docs/section-order.md) | Section editing and composition |
| [Shared packages](docs/shared-packages.md), [section migration](docs/pageforge-section-migration.md) | Reuse boundaries and compatibility |
| [Themes](docs/themes.md), [Tailwind](docs/tailwind.md), [languages](docs/languages.md) | Presentation and localization |
| [Portfolio types](docs/portfolio-types.md), [SEO](docs/portfolio-seo.md), [homepage](docs/homepage.md) | Public routes and discovery |
| [Browser tests](docs/e2e.md), [legacy RLS review](docs/legacy-rls-review.md), [roadmap](docs/roadmap.md) | Detailed operations and remaining work |

## CV generation

Public CV endpoints generate PDFs from published data. Private downloads require the authenticated studio. Edit `packages/cv/templates/cv.json.hbs` for template changes; profile values are data, never executable template code.

```sh
pnpm cv:generate
# Public profile ID; main selects the original portfolio:
pnpm cv:generate --args output/my-cv.pdf main
```

The generator does not overwrite existing output. See [personal workspaces](docs/multiuser-cvs.md) for public/private behavior and deployment prerequisites.

## CI and deployment

[The workflow](.github/workflows/ci.yml) runs frozen installation, `pnpm check`, `pnpm test`, `pnpm build`, Chromium installation and `pnpm test:e2e` in the `Verify` job. Browser reports are retained for seven days.

Production deployment is a separate job that requires successful verification and a non-PR run on `main`. It uses `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from GitHub secrets, pulls production configuration, builds and deploys prebuilt output. Application variables belong in deployment configuration. See `apps/web/vercel.json` for build settings.

Require `Verify` before merging. If GitHub Actions is the intended sole release path, check the project's automatic Git deployment settings separately. A successful build does not confirm a deployment, migration or external provider setup.

## License

[MIT](LICENSE).
