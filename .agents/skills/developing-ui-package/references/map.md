# UI package map

Package `@shared/ui` in `packages/ui`. There is no `packages/sections` package. Older docs that call this package the portfolio section library are stale.

## Entry points

| Export                  | Path                               | Use                            |
| ----------------------- | ---------------------------------- | ------------------------------ |
| `@shared/ui/<folder>`   | `src/components/<folder>/index.ts` | One control family             |
| `@shared/ui/components` | `src/components/index.ts`          | Barrel of public controls      |
| `@shared/ui/theme`      | `src/theme/index.ts`               | `ThemeProvider`, `ThemeToggle` |
| `@shared/ui/providers`  | `src/providers/index.ts`           | `NotificationProvider`         |
| `@shared/ui/utils`      | `src/utils/index.ts`               | UI helpers                     |
| `@shared/ui/stores`     | `src/stores/index.ts`              | UI client stores               |

`package.json` `main` points at `src/index.ts`. Prefer the exports above.

## Source

| Path                                       | Owns                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/components/<folder>`                  | One primitive. Typical files are `Component.tsx`, `index.ts`, and `Component.stories.tsx` |
| `src/components/index.ts`                  | Public barrel. Update it with every new control                                           |
| `src/theme`                                | Document theme provider and toggle                                                        |
| `src/providers`                            | Notification provider                                                                     |
| `src/hooks` under a component folder       | Hooks that exist only for that control                                                    |
| `src/constants`, `src/utils`, `src/stores` | Shared UI support, not domain services                                                    |
| `CATALOG.md`                               | Public inventory. Update it in the same change as the export                              |

Catalog groups are Actions, Forms, Feedback, Overlays, Layout and surfaces, Navigation and chrome, Content, and Studio tools. Put a new row in the group that matches how a caller looks for it.

## Controls that are easy to misplace

| Already here                                                      | Do not rebuild it as                                                             |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Button`, `IconButton`, `Toggle`, `Switch`, `SegmentedControl`    | A one-off button in a section                                                    |
| `Input`, `TextField`, `Select`, `Form`                            | A second field primitive in `@shared/components`                                 |
| `Dialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu` | A hand-rolled overlay                                                            |
| `Toast`, `Toaster`, `SnackbarNotification`                        | A second notification system                                                     |
| `Card`, `AppearanceCard`, `VariantCard`                           | A new card shell with the same slots                                             |
| `Chat` and its parts                                              | The portfolio chat product. That surface is `@shared/components` `PortfolioChat` |

`@shared/components` form fields (`Field`, `LinesField`, `SelectField`) are editor fields. They compose these primitives. They are not a reason to add profile labels to `@shared/ui`.

## Story and test names

| Source       | Story                | Unit test         |
| ------------ | -------------------- | ----------------- |
| `Button.tsx` | `Button.stories.tsx` | `Button.test.tsx` |

Stories are loaded by `apps/storybook-app/.storybook/main.ts`. The preview wraps stories in `PageShell`. See the Storybook skill before changing decorators.

## Checks

```sh
pnpm --filter @shared/ui typecheck
pnpm --filter @shared/ui lint
pnpm exec vitest run --project unit packages/ui
pnpm check:exports
```

`pnpm check:exports` fails when an `exports` target file is missing. The script `folders:kebab` rewrites component folder names; run it only when the task is a folder rename, and update imports with it.
