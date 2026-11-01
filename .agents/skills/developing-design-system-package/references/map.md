# Design-system package map

Package `@shared/design-system` in `packages/design-system`. Stylesheets live at the package root. There is no `src` directory.

| File                 | Role                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| `globals.css`        | `@import "./styles.css"`                                                          |
| `styles.css`         | Tailwind import, layer imports, shared portfolio and studio rules, reduced motion |
| `theme.css`          | Token layer                                                                       |
| `themes.css`         | Named portfolio themes                                                            |
| `shadcn.css`         | Shadcn token layer                                                                |
| `components.css`     | Shared component skins                                                            |
| `sections.css`       | Section styles                                                                    |
| `portfolios.css`     | Portfolio layout styles                                                           |
| `portfolio-chat.css` | Chat styles                                                                       |
| `postcss.config.js`  | Shared PostCSS config                                                             |
| `package.json`       | CSS export map                                                                    |
| `CATALOG.md`         | Public inventory                                                                  |

## Who imports it

| Consumer                                    | Import                              |
| ------------------------------------------- | ----------------------------------- |
| `apps/my-dev-studio/app/layout.tsx`         | `@shared/design-system/globals.css` |
| `apps/storybook-app/.storybook/preview.tsx` | `@shared/design-system/globals.css` |

`PageShell` from `@shared/components/layout` sets `data-theme`, accent, and portfolio theme on the document. Theme ids come from `@shared/config`.

## Stale glob

`styles.css` `@source` lines that mention `apps/web` should be updated to `apps/my-dev-studio` when that file is edited. Do not add a new `apps/web` directory.

## Checks

```sh
pnpm check:exports
pnpm --filter my-dev-studio dev
pnpm --filter storybook-app storybook
```
