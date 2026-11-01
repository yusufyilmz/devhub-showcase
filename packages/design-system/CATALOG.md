# Design system catalog

Global CSS and design tokens for `@shared/design-system`. Import a stylesheet. There is no JavaScript entry point.

| Export                                     | File                 | Use                      |
| ------------------------------------------ | -------------------- | ------------------------ |
| `@shared/design-system/styles.css`         | `styles.css`         | Combined stylesheet      |
| `@shared/design-system/globals.css`        | `globals.css`        | Global base styles       |
| `@shared/design-system/theme.css`          | `theme.css`          | Theme tokens             |
| `@shared/design-system/themes.css`         | `themes.css`         | Portfolio theme variants |
| `@shared/design-system/shadcn.css`         | `shadcn.css`         | Shadcn token layer       |
| `@shared/design-system/components.css`     | `components.css`     | Shared component styles  |
| `@shared/design-system/sections.css`       | `sections.css`       | Section styles           |
| `@shared/design-system/portfolios.css`     | `portfolios.css`     | Portfolio layout styles  |
| `@shared/design-system/portfolio-chat.css` | `portfolio-chat.css` | Portfolio chat styles    |
| `@shared/design-system/postcss.config`     | `postcss.config.js`  | Shared PostCSS config    |

## Semantic themes

`globals.css` / `styles.css` load only Tailwind and the shadcn system. Select
`data-brand="white|sand|aqua"` and `data-theme="light|dark"` on the document root.
The `dark` utility variant accepts both `.dark` and `data-theme="dark"`.
Root attributes also cover dialogs and other portals mounted under the body.

| Directory               | Responsibility                                        |
| ----------------------- | ----------------------------------------------------- |
| `tokens/primitives.css` | Raw colors and default semantic values                |
| `tokens/palettes.css`   | Existing White, Sand and Aqua light/dark palettes     |
| `tokens/appearance.css` | Spacing, radius, borders, shadows and motion settings |
| `tokens/tailwind.css`   | Semantic Tailwind utility mappings                    |
| `tokens/base.css`       | Minimal semantic reset and color scheme               |
| `tokens/typography.css` | Optional font utilities                               |
| `legacy/`               | Existing portfolio/studio layout rules                |

Import `@shared/design-system/legacy.css` explicitly for existing portfolio
surfaces. It is excluded from Storybook's semantic entry, so the previous RGB
portfolio palettes and global control rules cannot override primitive stories.
The Next.js app keeps this compatibility import during the gradual migration.
Do not import legacy CSS into new primitive stories.

Run `pnpm --filter storybook-app storybook` and open **Design system / Themes**.
The toolbar selects brand, mode, radius and spacing. Theme selection is local to
Storybook and does not modify a user's saved portfolio settings.

`surfaces.css` owns shared card elevation, control shadows, focus outlines and
reduced motion. It is exported as `@shared/design-system/surfaces.css` and is
already included by `styles.css`. Product pages use these shared rules rather
than introducing new shadow recipes per page.
