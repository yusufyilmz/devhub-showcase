# Workspace map

| Location                                    | Responsibility                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| apps/web                                    | Next.js App Router routes, API handlers, metadata, portfolio and editor features                            |
| packages/content                            | Profile types, public seed content, themes, translations, section registry and composition metadata         |
| packages/lib                                | Zod validation, domain services, repository contracts, Supabase persistence and portfolio resource adapters |
| packages/auth                               | Reusable Supabase browser/server session and Google sign-in integration                                     |
| packages/components                         | Portable fields, cards, sortable lists, section views and media surfaces                                    |
| packages/ui                                 | Existing portfolio sections, navigation, theme provider and legacy UI adapters                              |
| packages/cv                                 | PDF data normalization, layouts and templates                                                               |
| packages/chat, cache, log                   | Chat integrations, caching and logging; not portfolio ownership authorities                                 |
| packages/typescript-config, tailwind-config | Shared compiler and styling configuration                                                                   |
| tests                                       | Vitest domain, API/service, UI and migration coverage                                                       |
| e2e                                         | Playwright scenarios and local fake Supabase transport                                                      |
| supabase/migrations                         | Reviewed schema and RLS history                                                                             |
| docs                                        | Architecture and operational references                                                                     |

Root package scripts coordinate packages with Turborepo. pnpm-workspace.yaml is the external dependency catalog. Add external versions there and reference catalog: in package manifests. Use workspace:* for internal dependencies. Keep package export maps explicit. Do not replace the package manager or add a second lockfile.

packages/sections contains the versioned section library with separate public renderers and client editors. Use explicit exports and keep auth/database access in app adapters. See docs/reference/pageforge-section-migration.md for all source families.
