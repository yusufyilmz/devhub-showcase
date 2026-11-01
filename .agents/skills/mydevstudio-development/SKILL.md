---
name: mydevstudio-development
description: Develop, test and review MyDevStudio changes. Use for workspace setup, package boundaries, dependencies, scripts, lint, type checks, production builds, Playwright and GitHub Actions failures.
---

# MyDevStudio development

Read [the workspace map](references/workspace.md) before choosing a package. Follow [the verification workflow](references/workflow.md) for implementation and PR validation. Run scripts/check-workspace.mjs from the repository root to confirm documented command and workspace assumptions without changing files.

Inspect current package.json files, pnpm-workspace.yaml, and .github/workflows/ci.yml rather than relying on remembered versions. The Next.js app is `apps/my-dev-studio` (`my-dev-studio`). Its routes are in `app/` and its data access is in `features/`. Storybook is `apps/storybook-app` (`storybook-app`). `apps/my-fitness-app` (`my-fitness-app`) is a separate Next.js app. Its tables are in `supabase/migrations` and use the same `auth.users` records as the studio. Use existing components and validated domain adapters. Keep changes focused and run checks appropriate to their behavior. Report failed or skipped verification accurately.

## Packages

Shared libraries live in `packages/` and use `@shared/*`. Depend on them with `workspace:*`. There is no `packages/sections` package. Section renderers and editors are inside `@shared/ui`. Page copy lives in `@shared/config`.

| Folder               | Package             | Use it for                                                                      |
| -------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `packages/ui`        | `@shared/ui`        | Controls, sections, studio and portfolio surfaces, theme, and global CSS        |
| `packages/config`    | `@shared/config`    | Profile types, themes, and section metadata , Page copy, including the home FAQ |
| `packages/lib`       | `@shared/lib`       | Validation, repositories, and Supabase access                                   |
| `packages/auth`      | `@shared/auth`      | Sessions and Google sign-in                                                     |
| `packages/cv`        | `@shared/templates` | CV PDFs                                                                         |
| `packages/assistant` | `@shared/assistant` | Portfolio and editing assistants                                                |
| `packages/cache`     | `@shared/cache`     | Cache integrations                                                              |
| `packages/runtime`   | `@shared/runtime`   | Shared runtime helpers                                                          |
| `packages/utils`     | `@shared/utils`     | Logging and other utilities                                                     |
| `packages/trello`    | `@shared/trello`    | Trello board UI                                                                 |

Do not move auth, database access, or route handlers into `@shared/ui`. Do not add an app feature file that only re-exports one of these packages. Pass fetching and navigation in from `apps/my-dev-studio/features`.

When the change is inside one package or app, read that skill too. Each one is a `developing-*-package` or `developing-*-app` directory next to this skill: `developing-ui-package`, `developing-config-package`, `developing-content-package`, `developing-lib-package`, `developing-auth-package`, `developing-cv-package`, `developing-assistant-package`, `developing-cache-package`, `developing-runtime-package`, `developing-utils-package`, `developing-trello-package`, `developing-my-dev-studio-app`, and `developing-storybook-app`.
