---
name: developing-ui-package
description: Develop controls, sections, studio and portfolio surfaces, theme,
  notifications, and global CSS in @shared/ui. Use when changing packages/ui, a
  button, form control, overlay, toast, stylesheet, theme token, section
  renderer or editor, PageShell, HeroSurface, or a studio screen that must stay
  free of route handlers.
---

# Developing the UI package

`packages/ui` is `@shared/ui`. It owns primitive controls, the theme and notification providers, portfolio sections and editors, studio and portfolio surfaces, and global CSS. Profile facts live in `@shared/config` and `@shared/lib`. Routes, fetching, and authorization live in `apps/my-dev-studio`. Session decisions live in `@shared/auth`.

Read [the file map](references/map.md) and [packages/ui/CATALOG.md](../../../packages/ui/CATALOG.md) before adding a public export. Visual recipes are in the root [DESIGN.md](../../../DESIGN.md). For a section, also read [mydevstudio-sections](../mydevstudio-sections/SKILL.md) and `docs/features/section-system.md`. For owner, publish, and privacy behavior, read [mydevstudio-business](../mydevstudio-business/SKILL.md). Workspace commands are in [mydevstudio-development](../mydevstudio-development/SKILL.md).

## Current feature ownership

Portfolio/studio, sections, chat, companion, examples and CV rendering now live in `packages/assistant`. Use its catalog and skill when editing those compositions; keep primitive controls, layout, tokens and global CSS in `packages/ui`. The application feature folders contain session/environment/routing adapters, not UI forwarding modules.

## Where a visual change goes

Stop at the first match:

1. The URL, metadata, or HTTP handler must exist. Put that in `apps/my-dev-studio/app`, and put data access in `features/`. Pass the result into the component.
2. A primitive control, generic layout, stylesheet or token belongs here. Portfolio/studio, section, editor, chat and companion compositions belong in `packages/assistant`.
3. The piece is only a re-export. Do not add it. Callers import the existing entry point.

A component receives data, labels, and callbacks as props. It does not choose an API URL. Leave out a fetch URL, session check, Stripe call, or Supabase query. Search the catalog before adding a second copy of a control.

## Add or change a control

1. Read the closest folder in the matching group: `src/buttons`, `src/forms`, `src/feedback`, `src/overlays`, `src/layout`, `src/navigation`, `src/display`, `src/cards`, or `src/customizers`. Match its file names, variants, and export style.
2. Put the control in a kebab-case folder inside that group. Add an explicit `exports` entry in `packages/ui/package.json`. `@shared/ui/button` resolves to `src/buttons/button/index.ts`. There is no wildcard export.
3. Export it from that folder's `index.ts` and from the group `index.ts`. `src/components/index.ts` is the `@shared/ui/components` barrel.
4. Add a row to `packages/ui/CATALOG.md` in the matching group: Actions, Forms, Feedback, Overlays, Layout and surfaces, Navigation and chrome, Content, or Studio tools.
5. Colocate `Component.stories.tsx`. Storybook already loads `packages/ui/src/**/*.stories.*`. Do not copy the component into `apps/storybook-app`.
6. Colocate `Component.test.tsx` when behavior matters: keyboard operation, open and close, disabled state, or a variant that changes meaning. Start the file with `describe`. Keep `it` inside that suite.
7. Style with the existing tokens, `class-variance-authority`, and `cn`. Prefer the Radix or Base UI primitive already used by the neighboring control. Keep a visible focus state, an accessible name, and a reduced-motion path when the control animates.

The folder `src/layout/seperator` is spelled that way on purpose. Renaming it changes `@shared/ui/seperator`. Update the export, catalog, and every caller in the same change, or leave the folder name alone. `pnpm --filter @shared/ui folders:kebab` rewrites folder names. Run it only for a folder rename, and update imports with it.

Named portfolio actions such as `DownloadCVButton` live in `src/buttons/buttons`. A new generic action stays generic. An action that needs profile data, a download route, or owner state receives that route as a prop.

`LoginForm` lives in `src/forms/login-form`. Shared sign-in presentation is `@shared/ui/site-login` in `src/forms/site-login`. Session handlers stay in the auth package and the app.

## Change a section

Read `packages/config/src/sections/section-registry.ts`, `custom-sections.ts`, and `packages/lib/src/schemas/section/index.ts` first.

1. Keep content identity, renderer choice, and presentation separate. Built-in sections use fixed profile fields. Custom sections use stable UUID ids.
2. Add the view under `src/sections/<name>`. Export it from `src/sections/index.ts`, which is `@shared/assistant/sections`.
3. Register the renderer in `src/sections/renderers/renderers.tsx` so `RenderSection` can resolve the saved type. Register the editor in `src/sections/editors/editors.tsx` so `EditSection` can resolve it.
4. Update `@shared/config` metadata and `@shared/lib` validation in the same change when the saved shape changes. Documents that omit the new field must still render.
5. Do not accept an arbitrary component path, script, or raw HTML. Do not embed an arbitrary user-provided iframe. Social and video rules are in the sections skill.
6. Add a colocated story and a unit test for defaults, empty content, and a earlier document that omits the field.

Item, list, and form parts stay in the section folder. Most sections export a matching editor from that folder. `CVSection`, `AboutMeSection`, `EducationsSection`, `ExperienceSection`, `ReferralSection`, `ReviewSection`, and `SummarySection` do not. `SkillSection` exports `SkillsEditor`. Check the catalog before assuming an editor export exists.

Studio section tools live in `src/sections/studio` (`@shared/assistant/sections/studio`): order, settings, templates, and custom sections. Homepage compositions live in `src/sections/home-section` and export from `@shared/assistant/sections`.

Editor building blocks live in `src/editors`: `CollectionEditor`, `SortableList`, `SectionContentEditor`, `OptionsEditor`, and `SourceEditor`. `SortableList` commits a completed reorder through `onChange`. It does not persist.

## Studio and portfolio surfaces

Fetching and navigation stay in the app feature. The screen accepts the snapshot, the save function, and links as props. Do not add `features/<name>.tsx` in the app that only re-exports a shared component. Billing presentation may live here. The Stripe gateway, prices, and account status stay in `apps/my-dev-studio/features/billing`.

| Surface                   | Path                | Export                                    |
| ------------------------- | ------------------- | ----------------------------------------- |
| Portfolio editors         | `src/portfolio`     | `@shared/assistant/portfolio`             |
| Hero media                | `src/layout/hero`   | `HeroSurface` through `@shared/ui/layout` |
| Work imagery              | `src/display/media` | `WorkMedia` through `@shared/ui/display`  |
| Chat bubbles and composer | `src/chat`          | `@shared/assistant/chat-ui`               |
| Portfolio chat scope      | `src/providers`     | `PortfolioChatProvider`                   |
| Google import review      | `src/google-import` | `@shared/ui/google-import`                |
| Appearance editor         | `src/theme/studio`  | `@shared/ui/theme/studio`                 |

Chat presentation lives in `packages/assistant/src/components/chat`, including assistant chat, portfolio dialogs, chat sections, composers and agent companions. Both the package export and root TypeScript alias resolve `@shared/assistant/chat-ui` to `src/chat/index.ts`. Assistant models stay in the assistant package; portfolio chat access validation stays in the app’s chat feature.

Chat placed inside a portfolio section stays in that section folder. Visitor authorization and rate limits stay in the app, `@shared/lib`, and `@shared/lib/cache`. This package renders the conversation it is given.

Hero text must stay readable over image and video. Video needs a pause control and a reduced-motion path. Keep the plain hero when media is unset. Do not autoplay audio.

## Theme and providers

`src/theme` exports `ThemeProvider` and `ThemeToggle` as `@shared/ui/theme`. `ThemeProvider` reads `useUserConfigStore` from `@shared/runtime`. `src/providers` exports `NotificationProvider`, `PageProviders`, `StudioRequestProvider`, and `PortfolioChatProvider` as `@shared/ui/providers`.

`PageShell` in `src/layout/page-shell` sets `data-theme`, accent, and portfolio theme on the document. Theme ids come from `@shared/config`.

## Stylesheets

`src/styles` keeps tokens and the foundation layer. See [DESIGN.md — Stylesheet architecture](../../../DESIGN.md#stylesheet-architecture) and `src/styles/STYLES.md` (pointer only). The app root layout imports `@shared/ui/globals.css` (the same file as `app.css`). Storybook preview imports `@shared/ui/foundation.css`. Do not add a second global entry in `apps/my-dev-studio` or `apps/storybook-app`.

| Export                      | File                                  | Use                                                         |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `@shared/ui/foundation.css` | `styles/foundation.css`               | Tailwind, tokens, surfaces — Storybook and token-only hosts |
| `@shared/ui/app.css`        | `styles/app.css`                      | Foundation + portfolio bundle — same as full app CSS        |
| `@shared/ui/globals.css`    | `styles/app.css`                      | Same file as `app.css` (MyDevStudio layout)                 |
| `@shared/ui/styles.css`     | `styles/foundation.css`               | Same file as `foundation.css`                               |
| `@shared/ui/shadcn.css`     | `styles/tokens/index.css`             | Token aggregator                                            |
| `@shared/ui/theme.css`      | `styles/foundation/theme-aliases.css` | Theme aliases                                               |
| `@shared/ui/themes.css`     | `layout/portfolio/presets.css`        | Portfolio theme presets                                     |
| `@shared/ui/components.css` | `layout/portfolio/portfolio.css`      | Studio and portfolio control skin                           |
| `@shared/ui/sections.css`   | `layout/section/sections.css`         | Section frame                                               |
| `@shared/ui/portfolios.css` | `layout/portfolio/layouts.css`        | Published portfolio layouts                                 |
| `@shared/ui/layout.css`     | `navigation/chrome.css`               | Site header, nav, and footer chrome                         |
| `@shared/ui/surfaces.css`   | `cards/surfaces.css`                  | Shared control surfaces                                     |
| `@shared/ui/postcss.config` | `postcss.config.js`                   | Shared PostCSS config                                       |

Put a new brand token in `src/styles/tokens`. Put other CSS next to the component that imports it. Shared portfolio skins live in `src/layout/portfolio`. Section frame rules live in `src/layout/section/sections.css`. Chat rules live beside the chat component in `packages/assistant`.

Adding a theme id requires the id and palette in `@shared/config` `portfolioThemes` and `portfolioAccents`, and the CSS variables in this package. Add a preview swatch only when the studio already shows one for the other accents. CV accent hex values are chosen in `@shared/assistant/cv` `createCvData`. Update that file when the accent set changes.

`layout/portfolio/portfolio.css` and `cards/surfaces.css` already shorten animation under `prefers-reduced-motion`. Keep those blocks. New animation needs a reduced-motion path. Do not add `!important` for ordinary layout. Portfolio layout collapses at 767px. Match that breakpoint for a new portfolio rule, and check a desktop width and a 767px width after a layout change.

`foundation.css` `@source` globs must include `apps/my-dev-studio/app`, `apps/my-dev-studio/features`, `apps/storybook-app`, and `packages/ui/src`. Do not recreate `apps/web`.

Tailwind and PostCSS use `catalog:`. Do not add a second CSS framework. A new stylesheet needs an `exports` entry and a catalog row.

## Imports and dependencies

Keep component contracts in a colocated `types.ts` and reusable variants, class
maps, and style helpers in `styles.ts`. Use type-only imports in type modules.
Style modules must not import component implementations. Preserve existing public
type and variant exports when extracting them. Components import their own CSS;
tokens, themes, layouts, and global resets remain centralized.

```ts
import { Button } from "@shared/ui/button";
import { ThemeProvider } from "@shared/ui/theme";
import { NotificationProvider } from "@shared/ui/providers";
```

Use a subpath from another package. Do not reach into `packages/ui/src` from outside, and do not import `@shared/ui` from inside this package. Biome requires relative imports here. `@shared/ui/utils` is a separate entry point. Add a public entry only by editing `package.json` `exports`, then run `pnpm check:exports`.

External packages use `catalog:` in `pnpm-workspace.yaml`. Some existing UI dependencies are pinned directly. Do not add another direct pin. Internal packages use `workspace:*`. This package may use `@shared/auth`, `@shared/config`, `@shared/lib`, and `@shared/runtime`. Do not import `apps/my-dev-studio`.

## Verification

```sh
pnpm --filter @shared/ui typecheck
pnpm --filter @shared/ui lint
pnpm exec vitest run --project unit packages/ui/src/<path>.test.tsx
pnpm --filter storybook-app storybook
pnpm check:exports
```

Run `pnpm check` before a PR that changes exports or shared types. In Storybook, open the story and use the control. Check the desktop canvas and a narrow viewport when layout changed.

For a stylesheet, also run `pnpm --filter my-dev-studio dev`. Open the published portfolio page and the studio editor that use the rule. Toggle the theme and accent the rule claims to support.

App routes that render the changed surface still need the app skill and a browser pass against the dev server.

## Related skills

- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
- [Developing the Storybook app](../developing-storybook-app/SKILL.md)
- [Sections](../mydevstudio-sections/SKILL.md)
- [Developing the CV package](../developing-cv-package/SKILL.md)
