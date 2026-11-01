---
name: developing-ui-package
description: Develop primitive controls, the theme provider, and notifications in @shared/ui. Use when adding or changing a button, form control, overlay, layout primitive, icon, toast, theme toggle, or other control in packages/ui.
---

# Developing the UI package

`packages/ui` is `@shared/ui`. It owns primitive controls, the theme provider, and the notification provider. Portfolio sections, studio screens, and editors live in `@shared/components`. Profile facts live in `@shared/config` and `@shared/lib`.

Read [the file map](references/map.md) before adding a control. Read [packages/ui/CATALOG.md](../../../packages/ui/CATALOG.md) before adding a public export. Visual recipes for the product look are in the root [DESIGN.md](../../../DESIGN.md). Also read [mydevstudio-development](../mydevstudio-development/SKILL.md) for workspace commands.

## What belongs here

- A control another surface can reuse without knowing a route, a username, or a database.
- Theme wiring in `src/theme`: `ThemeProvider` and `ThemeToggle`.
- Notification wiring in `src/providers`: `NotificationProvider`.
- Shared icons, form controls, overlays, layout primitives, and feedback components.

Leave these out:

- A section renderer or editor. That is `@shared/components` and the sections skill.
- A fetch URL, session check, Stripe call, or Supabase query.
- A new copy of a control that already exists. Search `src/components` and the catalog first.
- App-only composition. The Next.js app passes data and navigation in.

## Add or change a control

1. Read the closest existing folder under `packages/ui/src/components`. Match its file names, variants, and export style.
2. Put the control in a kebab-case folder. The public subpath is the folder name: `@shared/ui/button` resolves through the `./*` export to `src/components/*/index.ts`.
3. Export the component from that folder's `index.ts` and from `src/components/index.ts`.
4. Add a row to `packages/ui/CATALOG.md` in the matching group.
5. Colocate a story as `Component.stories.tsx` in the same folder. `apps/storybook-app` already loads `packages/ui/src/**/*.stories.*`. Do not copy the component into the Storybook app.
6. Colocate a unit test when behavior matters: keyboard operation, open and close, disabled state, or a variant that changes meaning. Name it `Component.test.tsx`. Start the file with `describe`. Keep `it` inside that suite.
7. Style with the existing tokens, `class-variance-authority`, and `cn`. Prefer the Radix or Base UI primitive already used by the neighboring control. Keep a visible focus state, an accessible name, and a reduced-motion path when the control animates.
8. Cover loading, empty, and error presentation only when this control owns that state. Page-level empty and error screens already exist.

The folder `src/components/seperator` is spelled that way on purpose. Renaming it changes the import `@shared/ui/seperator`. Update the export, catalog, and every caller in the same change, or leave the folder name alone.

Named portfolio actions such as `DownloadCVButton` already live in `src/components/buttons`. A new generic action stays generic. An action that needs profile data, a download route, or owner state belongs in `@shared/components` or the app, with the route passed in.

## Imports

```ts
import { Button } from "@shared/ui/button";
import { ThemeProvider } from "@shared/ui/theme";
import { NotificationProvider } from "@shared/ui/providers";
```

Use a subpath. Do not reach into `packages/ui/src` from another package. `@shared/ui/components` is the barrel. `@shared/ui/utils` and `@shared/ui/stores` are separate entry points. Add a new entry point only by editing `package.json` `exports`, then run `pnpm check:exports`.

## Dependencies and boundaries

External packages use `catalog:` in `pnpm-workspace.yaml`. Some existing UI dependencies are pinned directly; do not add another direct pin. Internal packages use `workspace:*`.

`@shared/ui` may use `@shared/config`, `@shared/design-system`, `@shared/lib`, and `@shared/runtime`. Do not import `apps/my-dev-studio`. Do not start a second design system. Global CSS stays in `@shared/design-system`.

## Verification

From the repository root:

```sh
pnpm --filter @shared/ui typecheck
pnpm exec vitest run --project unit packages/ui/src/components/<folder>/<file>.test.tsx
pnpm --filter storybook-app storybook
```

Run `pnpm check` before a PR that changes exports or shared types. In Storybook, open the new story, exercise the control, and check the desktop canvas and a narrow viewport when layout changed.

## Related skills

- [Developing the components package](../developing-components-package/SKILL.md) for sections, studio screens, and portfolio surfaces.
- [Developing the design-system package](../developing-design-system-package/SKILL.md) for tokens and global CSS.
- [Developing the Storybook app](../developing-storybook-app/SKILL.md) for preview and aliases.
