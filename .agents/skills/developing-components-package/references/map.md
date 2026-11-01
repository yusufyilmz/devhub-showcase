# Components package map

Package `@shared/components` in `packages/components`.

## Entry points

| Export                                                     | Source                            |
| ---------------------------------------------------------- | --------------------------------- |
| `@shared/components`                                       | `src/index.ts`                    |
| `@shared/components/sections`                              | `src/sections/variants/index.ts`  |
| `@shared/components/section/renderers`                     | `src/sections/renderers/index.ts` |
| `@shared/components/section/editors`                       | `src/sections/editors/index.ts`   |
| `@shared/components/editor`                                | `src/editor/index.ts`             |
| `@shared/components/forms` and `@shared/components/fields` | `src/forms`                       |
| `@shared/components/layout`                                | `src/layout/index.ts`             |
| `@shared/components/studio`                                | `src/studio/index.ts`             |
| `@shared/components/login`                                 | `src/auth/login-panel.tsx`        |
| `@shared/components/pages`                                 | `src/pages/index.ts`              |
| `@shared/components/portfolio`                             | `src/portfolio/index.ts`          |
| `@shared/components/portfolio-chat`                        | `src/portfolio/chat/index.ts`     |
| `@shared/components/chat`                                  | `src/chat/index.ts`               |
| `@shared/components/containers`                            | `src/containers/index.ts`         |

`src/index.ts` re-exports login, chat, editor list helpers, form fields, shells, error pages, portfolio surfaces, and every section variant. Renderer and editor maps stay on their own entry points: `RenderSection` and `EditSection`.

## Source tree

| Path                               | Owns                                                     |
| ---------------------------------- | -------------------------------------------------------- |
| `src/sections/variants/<name>`     | Section view, local parts, and usually the editor        |
| `src/sections/renderers`           | `RenderSection` and `sectionRenderers`                   |
| `src/sections/editors/editors.tsx` | `EditSection` and `sectionEditors`                       |
| `src/sections/presenter`           | Shared section presentation                              |
| `src/sections/__fixtures__`        | Checked-in section fixtures, including PageForge samples |
| `src/studio/admin`                 | Owner editors, including profile and skills editors      |
| `src/studio/billing`               | Billing views. No Stripe secret handling                 |
| `src/studio/management`            | Managed-portfolio presentation                           |
| `src/studio/examples`              | Example content and `examples.css`                       |
| `src/layout`                       | `StudioShell`, `PageShell`, `PortfolioLayout`            |
| `src/editor`                       | Collection, content, options, and source editors         |
| `src/forms`                        | `Field`, `LinesField`, `SelectField`, `EmptyState`       |
| `src/portfolio`                    | Hero and work media, plus `chat/` for `PortfolioChat`    |
| `src/chat`                         | Generic chat presentation parts                          |
| `src/pages`                        | `ErrorPage`, `NotFoundPage`                              |
| `src/containers`                   | Preview containers                                       |
| `src/shared`                       | Small shared helpers for this package                    |
| `CATALOG.md`                       | Public inventory                                         |

## Files to open for a section change

1. `packages/config/src/sections/section-registry.ts`
2. `packages/config/src/sections/authorable-sections.ts`
3. `packages/config/src/sections/custom-sections.ts`
4. `packages/lib/src/domain/section.ts`
5. `src/sections/variants/<name>`
6. `src/sections/variants/index.ts`
7. `src/sections/renderers`
8. `src/sections/editors/editors.tsx`
9. `CATALOG.md`

A persisted field also updates `packages/config/src/profile/profile.ts` and `packages/lib/src/domain/profile.ts`.

## Props that must stay outside

| Concern                                 | Owner                                                  |
| --------------------------------------- | ------------------------------------------------------ |
| Which user is signed in                 | `apps/my-dev-studio/features/admin` and `@shared/auth` |
| Whether a profile is public             | `@shared/lib` published-profile path and the app route |
| Save URL and revision conflict handling | App route calls `@shared/lib` `ProfileService`         |
| Stripe checkout                         | `features/billing`                                     |
| Rate limit                              | `@shared/cache`, called from the app route             |

## Checks

```sh
pnpm --filter @shared/components typecheck
pnpm exec vitest run --project unit packages/components
pnpm check:exports
```
