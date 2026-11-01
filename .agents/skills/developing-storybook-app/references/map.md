# Storybook app map

Package `storybook-app` in `apps/storybook-app`. Dev server port 6006.

| Path                             | Role                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `.storybook/main.ts`             | Addons, framework, story globs, Next aliases                   |
| `.storybook/preview.tsx`         | `globals.css`, `PageShell` decorator, a11y and docs parameters |
| `.storybook/next-link.tsx`       | Stand-in for `next/link`                                       |
| `.storybook/next-image.tsx`      | Stand-in for `next/image`                                      |
| `.storybook/next-font-google.ts` | Stand-in for `next/font/google`                                |
| `.storybook/next-navigation.ts`  | Stand-in for `next/navigation`                                 |
| `vite.config.ts`                 | Vite app config                                                |
| `postcss.config.cjs`             | PostCSS for this app                                           |
| `src/App.tsx`, `src/main.tsx`    | Vite shell. Not the component catalog                          |
| `package.json`                   | `storybook`, `storybook:clean`, `build-storybook`              |

## Where stories live

| Stories                       | Glob in `main.ts`                        |
| ----------------------------- | ---------------------------------------- |
| UI primitives                 | `packages/ui/src/**/*.stories.*`         |
| Sections and studio UI        | `packages/components/src/**/*.stories.*` |
| Anything added under this app | `apps/storybook-app/src/**/*.stories.*`  |

Prefer the package folder. A story file uses the component's base name: `admin-login.stories.tsx` next to `admin-login.tsx`.

## Decorator contract

- Import `@shared/design-system/globals.css` once in preview.
- Wrap with `PageShell` unless the story component is `PageShell`.
- Default appearance is accent `cyan` and theme `studio`.
- `storageKey` is `storybook-document-shell`.
- A11y `test` is `todo`.

## Checks

```sh
pnpm --filter storybook-app typecheck
pnpm --filter storybook-app storybook
```
