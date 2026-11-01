---
name: developing-storybook-app
description: Develop Storybook in apps/storybook-app. Use when changing Storybook config, Next.js aliases, the PageShell preview decorator, story discovery globs, or how stories from packages/ui and packages/components are loaded.
---

# Developing the Storybook app

`apps/storybook-app` is the Storybook host, package name `storybook-app`. It renders stories. It does not own the components. Stories for controls live next to the component in `packages/ui`. Stories for sections, studio screens, and portfolio surfaces live next to the component in `packages/components`.

Read [the file map](references/map.md). Read [developing-ui-package](../developing-ui-package/SKILL.md) or [developing-components-package](../developing-components-package/SKILL.md) before adding a story for a component in those packages.

## What belongs in this app

- `/.storybook/main.ts` story globs, addons, and Vite aliases.
- `/.storybook/preview.tsx` global decorator and parameters.
- The Next.js stand-ins: `next-link.tsx`, `next-image.tsx`, `next-font-google.ts`, and `next-navigation.ts`.
- Vite config used by the app's own `dev` and `build` scripts.

Leave these out:

- A new product component under `apps/storybook-app/src`. `src/App.tsx` is the Vite shell, not a portfolio surface.
- A copy of a component so the story can import a local file. Import `@shared/ui` or `@shared/components`.
- Fetching, Supabase, Stripe, or a real profile. Pass fixture props.
- Auth decisions. `LoginPanel` stories receive endpoint props. They do not call the auth handlers.

## Story discovery

`main.ts` loads:

- `../src/**/*.stories.*` and `../src/**/*.mdx`
- `../../../packages/ui/src/**/*.stories.*`
- `../../../packages/components/src/**/*.stories.*`

Name the story `component.stories.tsx` beside the source. That is enough for it to appear. Do not register stories one by one. `@shared/trello` is not in this glob. Do not add it unless the task is specifically to host Trello stories, and then keep those stories free of live API tokens.

Addons are Chromatic, Vitest, a11y, and docs. The framework is `@storybook/react-vite`. Resolve addon paths with `getAbsolutePath` so the monorepo can find them.

## Preview

`preview.tsx` imports `@shared/design-system/globals.css`. The decorator wraps a story in `PageShell` with accent `cyan`, theme `studio`, language `en`, and `embed`. When the story's component is `PageShell` itself, the decorator renders the story without a second shell. Keep that guard.

If you change the default accent, theme, or storage key, check stories that assert on those attributes. `storageKey` is `storybook-document-shell` so Storybook does not share a browser theme key with the app session by accident.

A11y tests are set to `todo`. That shows violations in the Storybook test UI and does not fail CI. Do not flip it to `off` to hide a regression in a component you are adding. Fix the component, or leave the existing mode alone.

Docs render stories in an iframe with a default height of 480. Controls match color and date prop names.

## Next.js aliases

Components import `next/link`, `next/image`, `next/font/google`, and `next/navigation`. Vite would not understand those packages as the app does. `viteFinal` aliases them to the files in `.storybook/`. When a component starts importing another `next/*` module, add a stand-in here and an alias entry. Keep the stand-in small. `process.env.NEXT_PUBLIC_API_URL` is defined as `http://localhost:3000` for the Storybook build. Do not point that at production, and do not put secrets in `config.define`.

## Commands

```sh
pnpm --filter storybook-app storybook
pnpm --filter storybook-app storybook:clean
pnpm --filter storybook-app build-storybook
pnpm --filter storybook-app typecheck
```

`storybook` serves on port 6006. `storybook:clean` deletes `node_modules/.cache` and `node_modules/.vite` for this app. Run it when the optimizer serves a stale story. Do not delete the repository's `node_modules` from this script.

`build` is `tsc -b && vite build`. That is the Vite app build, not the Storybook static build. Use `build-storybook` to compile the storybook.

## Verify a story

Open the story in the running Storybook. Use the control, not only the first render. Check the default canvas and a narrow viewport when the component lays out differently. Confirm the story does not throw when `PageShell` provides theme attributes. If the story is for `PageShell`, confirm it is not wrapped twice.

Shared package changes still need that package's typecheck and unit test. This app's typecheck does not replace `@shared/ui` or `@shared/components` typecheck.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the components package](../developing-components-package/SKILL.md)
- [Developing the design-system package](../developing-design-system-package/SKILL.md)
