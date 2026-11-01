---
name: developing-design-system-package
description: Change global CSS and design tokens in @shared/design-system. Use when editing stylesheets, theme tokens, section or portfolio CSS, portfolio chat CSS, or the shared PostCSS config in packages/design-system.
---

# Developing the design-system package

`packages/design-system` is `@shared/design-system`. It owns global CSS and design tokens. There is no JavaScript entry point. Import a stylesheet export. Primitive controls stay in `@shared/ui`. Section markup stays in `@shared/components`. Theme ids and palettes that profile data may select stay in `@shared/config`.

Read [the file map](references/map.md), [packages/design-system/CATALOG.md](../../../packages/design-system/CATALOG.md), and the root [DESIGN.md](../../../DESIGN.md).

## Stylesheets

| Export                                     | File                 | Use                                                   |
| ------------------------------------------ | -------------------- | ----------------------------------------------------- |
| `@shared/design-system/styles.css`         | `styles.css`         | Combined stylesheet                                   |
| `@shared/design-system/globals.css`        | `globals.css`        | Imports `styles.css`. The app and Storybook load this |
| `@shared/design-system/theme.css`          | `theme.css`          | Theme tokens                                          |
| `@shared/design-system/themes.css`         | `themes.css`         | Portfolio theme variants                              |
| `@shared/design-system/shadcn.css`         | `shadcn.css`         | Shadcn token layer                                    |
| `@shared/design-system/components.css`     | `components.css`     | Shared component styles                               |
| `@shared/design-system/sections.css`       | `sections.css`       | Section styles                                        |
| `@shared/design-system/portfolios.css`     | `portfolios.css`     | Portfolio layout styles                               |
| `@shared/design-system/portfolio-chat.css` | `portfolio-chat.css` | Portfolio chat styles                                 |
| `@shared/design-system/postcss.config`     | `postcss.config.js`  | Shared PostCSS config                                 |

`globals.css` is a single import of `styles.css`. `styles.css` imports the other layers and holds shared layout rules for the public portfolio and the studio shell. Put a token in `theme.css` or `themes.css`. Put a control skin that is shared across components in `components.css`. Put section frame rules in `sections.css` or `portfolios.css`. Put chat rules in `portfolio-chat.css`.

The app root layout imports `@shared/design-system/globals.css`. Storybook preview imports the same file. Do not add a second global entry in `apps/my-dev-studio` or `apps/storybook-app`.

## Tokens and themes

Published pages and the studio share a system described in `DESIGN.md`: a navy public canvas, a cyan accent, and studio chrome with its own surfaces. Accents include cyan, violet, and emerald. Components select a theme with `data-theme` and `data-accent` through `PageShell`. Adding a theme id requires:

1. The id and palette in `@shared/config` `portfolioThemes` and `portfolioAccents`.
2. The CSS variables in this package.
3. A preview swatch only if the studio already shows one for the other accents.

Do not invent a parallel palette in a component file. Do not change a token so a published page and the PDF silently share one accent. CV accent hex values are chosen in `@shared/cv` `createCvData`. Update that file when the accent set changes.

## Motion, focus, and breakpoints

`styles.css` already shortens animations under `prefers-reduced-motion`. Keep that block. New animation needs a reduced-motion path. The existing `!important` on that media query is an accessibility override. Do not add `!important` for ordinary layout.

Public layout breakpoints in `styles.css` include 1050px and 767px. The section grid collapses to one column at 767px, and the section heading stops being sticky. Match those breakpoints when you add a portfolio rule. Check a desktop width and a 767px width in the browser after a layout change.

Hero text must stay readable. Do not cover links with decorative layers. The orbit decoration is `pointer-events: none`.

## Tailwind source globs

`styles.css` still contains `@source` globs aimed at `apps/web`. That app is gone. The Next.js app is `apps/my-dev-studio`. When you edit `styles.css`, point those globs at `apps/my-dev-studio/app` and `apps/my-dev-studio/features`, and include `packages/ui` and `packages/components` source if a class used there is missing from the built CSS. Do not recreate `apps/web`.

## Dependencies

Tailwind and PostCSS use `catalog:`. Do not add a second CSS framework. This package does not get a TypeScript `build` script. There is nothing to compile except CSS that consumers import.

A new stylesheet needs an `exports` entry and a catalog row. `files` in `package.json` is a short list. Update it when a published file must be included and is not already covered by the export.

## Verification

CSS changes are visible behavior. After editing a stylesheet:

```sh
pnpm --filter my-dev-studio dev
```

Open the published portfolio page and the studio editor that use the rule. Check desktop and a narrow viewport. Toggle the theme and accent the rule claims to support. For a control skin, also open the Storybook story:

```sh
pnpm --filter storybook-app storybook
```

Run `pnpm check:exports` if `package.json` exports changed.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the components package](../developing-components-package/SKILL.md)
- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the Storybook app](../developing-storybook-app/SKILL.md)
