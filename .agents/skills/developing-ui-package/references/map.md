# UI package map

Package `@shared/ui` in `packages/ui`. Controls, sections, studio and portfolio surfaces, theme providers, and global CSS all live here. There is no `packages/components`, `packages/design-system`, or `packages/sections` package.

## Entry points

`package.json` `exports` is the public contract. `main` points at `src/index.ts`, which is empty. Prefer a subpath.

| Export                                                                                                                           | Source                                            |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `@shared/ui/components`                                                                                                          | `src/components/index.ts`                         |
| `@shared/ui/<control>`                                                                                                           | Matching folder, for example `src/buttons/button` |
| `@shared/ui/buttons`, `./forms`, `./feedback`, `./overlays`, `./layout`, `./navigation`, `./display`, `./cards`, `./customizers` | That group's `index.ts`                           |
| `@shared/ui/theme`                                                                                                               | `src/theme/index.ts`                              |
| `@shared/ui/theme/studio`                                                                                                        | `src/theme/studio/index.ts`                       |
| `@shared/ui/providers`                                                                                                           | `src/providers/index.ts`                          |
| `@shared/ui/utils`                                                                                                               | `src/utils/index.ts`                              |
| `@shared/ui/sections`                                                                                                            | `src/sections/index.ts`                           |
| `@shared/ui/sections/studio`                                                                                                     | `src/sections/studio/index.ts`                    |
| `@shared/ui/portfolio`                                                                                                           | `src/portfolio/index.ts`                          |
| `@shared/ui/google-import`                                                                                                       | `src/google-import/index.ts`                      |
| `@shared/ui/chat`                                                                                                                | `src/display/chat/index.ts`                       |
| `@shared/ui/*.css` and `./postcss.config`                                                                                        | `src/styles` and `postcss.config.js`              |

The root `tsconfig.json` also aliases `@shared/ui/editor` to `src/editors/index.ts`, `@shared/ui/section/editors` to `src/sections/editors`, and `@shared/ui/section/renderers` to `src/sections/renderers`. Those aliases are for this workspace. A new public entry still needs a `package.json` export. `@shared/ui/login` and the `@shared/ui/chat` path alias point outside this package. See the skill.

## Source tree

| Path                                                                                                                                      | Owns                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/buttons`, `src/forms`, `src/feedback`, `src/overlays`, `src/layout`, `src/navigation`, `src/display`, `src/cards`, `src/customizers` | One control family per kebab-case folder                         |
| `src/components/index.ts`                                                                                                                 | Public barrel of those groups, plus sections and theme           |
| `src/theme`                                                                                                                               | `ThemeProvider`, `ThemeToggle`, studio appearance editor         |
| `src/providers`                                                                                                                           | Notification, page, studio request, and portfolio chat providers |
| `src/sections/<name>`                                                                                                                     | Section view, local parts, and usually the editor                |
| `src/sections/renderers/renderers.tsx`                                                                                                    | `RenderSection`                                                  |
| `src/sections/editors/editors.tsx`                                                                                                        | `EditSection`                                                    |
| `src/sections/studio`                                                                                                                     | Section order, settings, templates, custom sections              |
| `src/sections/home-section`                                                                                                               | Homepage compositions                                            |
| `src/sections/presenter`                                                                                                                  | Shared section presentation                                      |
| `src/sections/__fixtures__`                                                                                                               | Checked-in section fixtures                                      |
| `src/editors`                                                                                                                             | Collection, content, options, and source editors                 |
| `src/portfolio`                                                                                                                           | Language, portfolio type, and profile field editors              |
| `src/layout/hero`                                                                                                                         | `HeroSurface`                                                    |
| `src/layout/page-shell`                                                                                                                   | `PageShell`                                                      |
| `src/display/media`                                                                                                                       | `WorkMedia`                                                      |
| `src/display/chat`                                                                                                                        | Chat bubbles, composer, list, typing                             |
| `src/google-import`                                                                                                                       | Google import review UI                                          |
| `src/styles`                                                                                                                              | Global CSS, tokens, section and portfolio styles                 |
| `src/utils`, `src/constants`                                                                                                              | UI helpers, not domain services                                  |
| `CATALOG.md`                                                                                                                              | Public inventory                                                 |

## Files to open for a section change

1. `packages/config/src/sections/section-registry.ts`
2. `packages/config/src/sections/custom-sections.ts`
3. `packages/lib/src/domain/section.ts`
4. `src/sections/<name>`
5. `src/sections/index.ts`
6. `src/sections/renderers/renderers.tsx`
7. `src/sections/editors/editors.tsx`
8. `CATALOG.md`

A persisted field also updates `packages/config/src/profile/profile.ts` and `packages/lib/src/domain/profile.ts`.

## Styles

| File                            | Role                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `src/styles/globals.css`        | `@import "./styles.css"`                               |
| `src/styles/styles.css`         | Tailwind import, layer imports, `@source` globs        |
| `src/styles/theme.css`          | Semantic token aliases                                 |
| `src/styles/themes.css`         | Named portfolio themes                                 |
| `src/styles/tokens/`            | Appearance, base, palettes, primitives, typography     |
| `src/styles/shadcn.css`         | Shadcn token layer                                     |
| `src/styles/components.css`     | Shared component skins, 767px collapse, reduced motion |
| `src/styles/sections.css`       | Section styles                                         |
| `src/styles/portfolios.css`     | Portfolio layout styles                                |
| `src/styles/portfolio-chat.css` | Chat styles                                            |
| `src/styles/surfaces.css`       | Surface styles and reduced motion                      |
| `postcss.config.js`             | Shared PostCSS config                                  |

`apps/my-dev-studio/app/layout.tsx` and `apps/storybook-app/.storybook/preview.tsx` import `@shared/ui/globals.css`.

## Props that must stay outside

| Concern                                 | Owner                                                     |
| --------------------------------------- | --------------------------------------------------------- |
| Which user is signed in                 | `apps/my-dev-studio/features/admin` and `@shared/auth`    |
| Whether a profile is public             | `@shared/lib` published-profile path and the app route    |
| Save URL and revision conflict handling | App route calls `@shared/lib` `ProfileService`            |
| Stripe checkout                         | `features/billing`                                        |
| Rate limit                              | `@shared/cache`, called from the app route                |
| Allowed theme ids                       | `@shared/config` `portfolioThemes` and `portfolioAccents` |

## Checks

```sh
pnpm --filter @shared/ui typecheck
pnpm --filter @shared/ui lint
pnpm exec vitest run --project unit packages/ui
pnpm check:exports
pnpm --filter storybook-app storybook
pnpm --filter my-dev-studio dev
```
