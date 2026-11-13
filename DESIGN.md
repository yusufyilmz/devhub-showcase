---
version: alpha
name: MyDevStudio
description: A portfolio and CV studio with two surfaces. Published pages sit on a deep navy canvas with a single cyan accent, Inter headlines, and quiet section cards. Editing chrome uses the shared UI kit — near-black ink on white, a gray scale, and small rounded controls. Color brands can swap, but the shape of the interface stays the same.

colors:
  ink: "#0a0a0a"
  canvas: "#ffffff"
  canvas-studio: "#090f1a"
  surface: "#f9f9f9"
  surface-studio: "#101929"
  surface-studio-soft: "#162234"
  surface-studio-light: "#f6f8fb"
  ink-studio: "#eaf1f9"
  ink-studio-light: "#192a3d"
  muted: "#757575"
  muted-studio: "#a0b1c6"
  muted-studio-light: "#536981"
  hairline: "color-mix(in srgb, #0a0a0a 14%, transparent)"
  hairline-studio: "#2b3c51"
  hairline-studio-light: "#cfdce7"
  primary: "#0a0a0a"
  on-primary: "#ffffff"
  secondary: "#151515"
  on-secondary: "#ededed"
  accent: "#67d8e7"
  accent-light: "#0d6e84"
  accent-brand: "#049ee2"
  destructive: "#ff5f53"
  danger-studio: "#ff9499"
  danger-studio-light: "#a82438"
  ring: "#959595"
  card: "#f9f9f9"
  popover: "#ffffff"

typography:
  display:
    fontFamily: "Inter, var(--font-heading), system-ui, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.025em
  h2:
    fontFamily: "Inter, var(--font-heading), system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.025em
  h3:
    fontFamily: "Inter, var(--font-heading), system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.025em
  h4:
    fontFamily: "Inter, var(--font-heading), system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.025em
  lead:
    fontFamily: "Inter, var(--font-body), system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: 0
  body:
    fontFamily: "Inter, var(--font-body), system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, var(--font-body), system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  button:
    fontFamily: "Inter, var(--font-body), system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  caption:
    fontFamily: "Inter, var(--font-body), system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  eyebrow:
    fontFamily: "Geist Mono, var(--font-geist-mono), ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.15em
  code:
    fontFamily: "Inter, var(--font-code), ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  pill: 9999px

spacing:
  unit: 4px
  xs: 6px
  s: 12px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 40px
  2xl: 56px
  3xl: 72px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 32px
    padding: 0 10px
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 32px
    padding: 0 10px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: 32px
    padding: 0 10px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.lg}"
    height: 32px
    padding: 0 10px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    height: 32px
    padding: 0 10px
  icon-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    size: 40px
  badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px 0
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 4px 12px
  dialog:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  section-card:
    backgroundColor: "{colors.surface-studio}"
    textColor: "{colors.ink-studio}"
    rounded: 14px
    padding: 24px
  studio-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas-studio}"
    typography: "{typography.body-sm}"
    rounded: 9px
    height: 46px
    padding: 12px 20px
---

# MyDevStudio

Published portfolios read as a dark studio: navy canvas, one cyan accent, Inter for reading, and a mono eyebrow for labels. The shared UI kit in `packages/ui` is the editing surface. It is closer to a compact product UI: white canvas, near-black primary, gray secondary, and small 8px corners.

Styles and tokens live in `packages/ui/src/styles`. Components in `packages/ui` consume those tokens. They do not invent a second palette. The folder map and export names are documented below; day-to-day edits follow the “where to edit” table.

## AI lookup guide

Before reading the full design reference, run these commands from the repository root:

```sh
pnpm --silent lookup design "spacing" --limit 1 --max-tokens 1000
pnpm --silent lookup design "typography" --limit 1
pnpm --silent lookup catalog "button" --package @shared/ui --limit 2
```

Use a few specific keywords: text searches require every query word to match. Results retain source references, parent prerequisites and named global constraints. Follow `hasMore` with `--cursor '<cursor>'` using the same query and filters. Retrieve a result or oversized-record locator with `pnpm --silent lookup section '<id>' --max-tokens 4000`. Increase the budget when a complete section does not fit; a budget failure does not mean the design rule is absent. Read the relevant design rules and mandatory instructions before implementation.

See the [AI quick start](.agents/README.md) and [full CLI usage](tools/cli/README.md#token-bounded-repository-lookup).

## Stylesheet architecture

Keep tokens and the foundation layer in `packages/ui/src/styles`. Use Tailwind
utilities and shared UI components for layouts and controls. Put component CSS
next to the component that loads it. The global bundles load tokens, themes,
layout rules and resets. Fitness styles live with the Fitness app. The
Storybook demo shell lives with the Storybook app.

Two stacks share one component library. **Foundation** is the token + Tailwind layer (`data-brand`, `data-theme`, appearance). **Portfolio** is the RGB palette model for published pages (`data-portfolio-theme`, section frames, site chrome). Storybook and token-only hosts load foundation only so toolbar brands are not overridden by portfolio remaps.

### Entry points

| Import                      | Loads                                                       |
| --------------------------- | ----------------------------------------------------------- |
| `@shared/ui/foundation.css` | Tailwind, design tokens, shared surfaces. **Storybook.**    |
| `@shared/ui/app.css`        | Foundation + portfolio bundle. **MyDevStudio root layout.** |
| `@shared/ui/globals.css`    | Same file as `app.css`.                                     |

Lazy or partial loads: `@shared/ui/portfolio/bundle.css` (portfolio CSS without the foundation `@source` setup), `@shared/assistant/examples.css` (example carousel pages).

### Repository layout

```tree
packages/ui/src/styles/
  app.css                 Full app (foundation + portfolio bundle)
  foundation.css          Tailwind + tokens + shared surfaces
  tokens/                 Brand palettes, modes, appearance, @theme extensions
    index.css             Token aggregator (export: @shared/ui/shadcn.css)
  foundation/             Theme aliases and shared design tokens
```

Component styles sit beside their components. Portfolio layout, presets, and the semantic bridge live in `packages/ui/src/layout/portfolio/`. Chat, editors, and section sheets live beside those components in `packages/assistant`. Public names such as `@shared/ui/components.css`, `@shared/ui/sections.css`, and `@shared/ui/surfaces.css` still resolve to those files.

### Where to edit

| Change                  | File                             |
| ----------------------- | -------------------------------- |
| New brand or mode token | `styles/tokens/`                 |
| Shadcn semantic token   | `styles/tokens/palettes.css`     |
| Studio control skin     | `layout/portfolio/portfolio.css` |
| Section layout          | `layout/section/sections.css`    |
| Portfolio theme preset  | `layout/portfolio/presets.css`   |
| Site header or nav      | `navigation/chrome.css`          |

Implementation detail for contributors: [packages/ui/src/styles/STYLES.md](packages/ui/src/styles/STYLES.md) mirrors this section and links back here.

## Colors

The component theme defaults to a light gray scale. Brand color is a swap, not a second system. The product default brand is cyan. Red is the accent used for a single contrast mark, such as the hero period. Destructive actions use the red-600 step, not the brand accent.

| Token                     | Value     | Use                                           |
| ------------------------- | --------- | --------------------------------------------- |
| `{colors.canvas}`         | `#ffffff` | Page and dialog background                    |
| `{colors.ink}`            | `#0a0a0a` | Primary text and primary buttons              |
| `{colors.surface}`        | `#f9f9f9` | Cards                                         |
| `{colors.muted}`          | `#757575` | Secondary text                                |
| `{colors.primary}`        | `#0a0a0a` | Default button, badge, selection              |
| `{colors.on-primary}`     | `#ffffff` | Text on primary                               |
| `{colors.secondary}`      | `#151515` | Secondary button                              |
| `{colors.destructive}`    | `#ff5f53` | Destructive text and soft destructive buttons |
| `{colors.hairline}`       | 14% ink   | Soft borders on cards, fields, and menus      |
| `{colors.ring}`           | `#959595` | Focus ring                                    |
| `{colors.accent}`         | `#67d8e7` | Published-page accent on the dark canvas      |
| `{colors.accent-light}`   | `#0d6e84` | Same accent when the published page is light  |
| `{colors.canvas-studio}`  | `#090f1a` | Published page background                     |
| `{colors.surface-studio}` | `#101929` | Published cards and header surface            |
| `{colors.ink-studio}`     | `#eaf1f9` | Published body text                           |

Sixteen brand ramps exist (sand, gray, slate, red, orange, yellow, moss, green, emerald, aqua, cyan, blue, indigo, violet, magenta, pink). Each ramp runs from step 100 (darkest) to 1200 (lightest), with 15%, 30%, and 50% mixes of step 600. Switching `data-brand` retints `--primary` and related surfaces. It does not change radii, type, or spacing.

Dark mode inverts the component theme: background becomes `#0a0a0a` and primary becomes `#ffffff`. The published page has its own light theme through `data-theme="light"` on the studio RGB tokens.

## Typography

Component type is Inter, loaded as `--font-heading`, `--font-body`, `--font-label`, and `--font-code`. Published chrome also references Geist Sans for body and Geist Mono for eyebrows and the scroll hint.

| Style                  | Size | Weight | Line height | Tracking | Use                                     |
| ---------------------- | ---- | ------ | ----------- | -------- | --------------------------------------- |
| `{typography.display}` | 36px | 700    | 1.25        | -0.025em | `Typography` h1                         |
| `{typography.h2}`      | 30px | 700    | 1.25        | -0.025em | h2                                      |
| `{typography.h3}`      | 24px | 600    | 1.25        | -0.025em | h3                                      |
| `{typography.h4}`      | 20px | 600    | 1.25        | -0.025em | h4                                      |
| `{typography.lead}`    | 18px | 500    | 1.625       | 0        | Lead                                    |
| `{typography.body}`    | 16px | 400    | 1.625       | 0        | Body                                    |
| `{typography.body-sm}` | 14px | 500    | 1.25        | 0        | Buttons, small body                     |
| `{typography.caption}` | 12px | 400    | 1.5         | 0        | Captions, badges                        |
| `{typography.eyebrow}` | 11px | 500    | 1.6         | 0.15em   | Section labels, uppercase               |
| `{typography.code}`    | 14px | 400    | 1.5         | 0        | Inline code on `{colors.muted}` surface |

The type scale is multiplied by `--text-scale` (default 1): 12, 14, 16, 18, 20, 24, and 30px. Published hero titles are the exception. They use `clamp(52px, 7vw, 96px)`, weight 650, and tracking `-0.07em`.

## Spacing

The comfortable scale is the default. Compact, cozy, wide, and extra scales exist as theme options and only change these steps.

| Token            | Value |
| ---------------- | ----- |
| `{spacing.unit}` | 4px   |
| `{spacing.xs}`   | 6px   |
| `{spacing.s}`    | 12px  |
| `{spacing.sm}`   | 16px  |
| `{spacing.md}`   | 24px  |
| `{spacing.lg}`   | 32px  |
| `{spacing.xl}`   | 40px  |
| `{spacing.2xl}`  | 56px  |
| `{spacing.3xl}`  | 72px  |

Published sections use a wider rhythm: 40px page padding, 82px section padding, and a 64px gap between the sticky heading column and the content. The content column starts at 1200px max width. The nav is 78px tall inside a 1280px bar.

## Shapes

Radius is multiplied by `--radius-scale` (default 1). Controls stay small. Cards are the roundest component surface.

| Token            | Value  | Use                          |
| ---------------- | ------ | ---------------------------- |
| `{rounded.xs}`   | 2px    | Close control                |
| `{rounded.sm}`   | 4px    | Tight chrome                 |
| `{rounded.md}`   | 6px    | Inputs, badges, icon buttons |
| `{rounded.lg}`   | 8px    | Buttons, dialogs             |
| `{rounded.xl}`   | 12px   | Cards                        |
| `{rounded.2xl}`  | 16px   | Large shells                 |
| `{rounded.pill}` | 9999px | Theme toggle, status dot     |

Published section cards use 14px. Studio buttons use 9px. Those are fixed radii, not the scale above.

## Elevation

Controls sit on the page as flat surfaces. A card or dialog is separated by its border, not by a drop shadow. Solid buttons and the selected segmented option use a 1px top inset highlight.

| Token | Value                                                                |
| ----- | -------------------------------------------------------------------- |
| `xs`  | `0 1px 2px rgb(0 0 0 / 0.05)`                                        |
| `sm`  | `0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`        |
| `md`  | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`   |
| `lg`  | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |

Fields have no inner shadow. In light mode they are `{colors.canvas}` with a border mixed toward `{colors.ink}`. In dark mode the fill is a 6% foreground wash. Dialogs and menus are flat panels with `{rounded.xl}` and a hairline. Published cards keep `0 6px 26px rgb(0 0 0 / 0.05)`. The sticky header is not elevated with a shadow. It uses an 88% background and an 18px backdrop blur.

Focus is a 2px ring at 40% `{colors.ring}` on components. A focused field also darkens its border to `{colors.ink}`. The published page keeps a 2px `{colors.accent}` outline with 4px offset. Disabled solid controls switch to the muted fill and muted text. They do not fade to 50% opacity. Published pages still fade disabled controls to 48%.

Motion is short. Cards wash their background on hover over 160ms and stay in place. Dialogs fade and scale from 95% over 200ms. The easing curve is `cubic-bezier(0.4, 0, 0.2, 1)`.

## Components

The recipes below are the pieces that define the look, in the same sense as Airbnb's search bar, listing card, and primary button. Controls, sections, editors, and chat surfaces from `packages/ui` are listed in [the UI catalog](packages/ui/CATALOG.md). Visual rules stay here. The catalog is the inventory. Package catalogs are generated with `pnpm generate:catalogs`; edit `catalog.template.md` for written guidance and run `pnpm check:catalogs` to verify the outputs.

### Button

`packages/ui/src/components/button`

**`button-primary`** — Background `{colors.primary}`, text `{colors.on-primary}`, a 1px top inset highlight, `{typography.button}`, radius `{rounded.lg}`, height 32px, horizontal padding 10px. Hover mixes the background to 90% opacity. This is the default action.

**`button-secondary`** — Transparent fill, `{colors.ink}` text, and a hairline border. Hover washes 5% foreground over the fill. It keeps the inset highlight.

**`button-outline`** — Transparent fill and a transparent border. Hover draws the hairline. It has no inset.

**`button-ghost`** — Transparent fill and muted text. Hover strengthens the text to `{colors.ink}`.

**`button-text`** — Same as ghost, with a 5% foreground wash on hover.

**`button-destructive`** — Solid `{colors.destructive}` fill, white text, and the same inset highlight. Hover mixes the fill to 90%.

**`button-link`** — `{colors.ink}` text with an underline on hover.

Sizes: `xs` 24px, `sm` 28px, default 32px, `lg` 36px. Icon-only sizes match those heights and are square. Icons inside a label are 16px, 14px at `sm`, and 12px at `xs`.

### Icon button

`packages/ui/src/components/icon-button`

40px square at the default size, 36px small, 44px large. Radius `{rounded.lg}`. Variants match the button set: solid default, transparent secondary, border-on-hover outline, text-only ghost, and a solid destructive fill. The published theme toggle is the circular exception: 40px, full pill, surface fill, hairline border, accent border on hover.

### Badge

`packages/ui/src/components/badge`

`{typography.caption}`, medium weight, full pill, padding 2px 8px. Default is a quiet foreground wash with a hairline. Secondary is a 12% primary wash. Outline is transparent with a hairline. Destructive is a 12% destructive wash with destructive text. The published status dot is separate: 6px, accent fill, and a 4px accent ring at 9% opacity.

### Card

`packages/ui/src/components/card`

Background `{colors.card}`, text `{colors.ink}`, 1px border, radius `{rounded.xl}`, vertical padding `{spacing.md}`, column layout with a `{spacing.md}` gap. Header and footer pad horizontally by `{spacing.md}`. The title is 16px semibold. Description is 14px muted. Hover washes 4% foreground over the fill. `interaction="lift"` swaps that wash for an 8% accent tint and a stronger accent border. The card does not move.

**`section-card`** is the published version. Background `{colors.surface-studio}`, 14px radius, 24px padding, and the soft shadow above. Hover shifts the border toward the accent.

### Input and textarea

`packages/ui/src/components/input` and `packages/ui/src/components/textarea`

Height 40px for a single-line field. Full width, radius `{rounded.lg}`, 1px soft hairline, `{colors.canvas}` fill, 12px horizontal padding. Type is 14px. Placeholder is muted. Focus raises the hairline to 32% ink and draws a 2px ring at 45% `{colors.ring}`. An invalid field uses `{colors.destructive}` for the border and ring. Disabled fields use the muted fill. Dark mode fills the field with 6% foreground. The textarea keeps the same chrome with a 96px minimum height.

### Dialog

`packages/ui/src/components/dialog`

Centered overlay at 40% black. The panel is `{colors.canvas}`, radius `{rounded.xl}`, a hairline, padding `{spacing.md}`, no drop shadow, max width 32rem. It fades and scales in over 200ms. The title is 18px semibold. The close control sits 16px from the top and right. Description text is 14px muted. Menus and popovers use the same flat panel.

### Typography component

`packages/ui/src/components/typography`

Use the named variants instead of setting size by hand. `h1`–`h6` map to the table above. `body1` is `{typography.body}`. `body2` and `small` are 14px. `caption` and `overline` are 12px. Overline is uppercase with wide tracking. `code` sits on `{colors.muted}` with `{rounded.sm}` and 6px horizontal padding. Color options are `default`, `muted`, `primary`, `destructive`, `success`, `warning`, and `info`.

### Layout

`packages/ui/src/components/flex`

`Flex` is the layout primitive. Direction, gap, and alignment use the spacing scale (`xs` through `3xl`). `FlexRow`, `FlexCol`, and `FlexStack` are the row, column, and stacked column. Gap defaults to `{spacing.md}` when a stack does not set one. Published pages still use the two-column section grid: 250px sticky heading and a fluid content column.

## Portfolio page

The published page is not a second component library. It is the same type and accent, applied to a dark canvas.

- Header sticks, blurs 18px, and draws a 60% hairline under a 78px bar.
- Nav links are 10px, weight 500, tracking `0.06em`.
- The hero title uses the display clamp. One accent-colored period is the only decorative color in the headline.
- The supporting line is `clamp(21px, 2.6vw, 32px)`, weight 450, muted.
- Intro copy is 15px with line height 1.85, max 680px.
- Primary and secondary studio buttons are 46px tall, 13px semibold, 9px radius. Primary is accent fill with studio-canvas text. Secondary is surface fill with a hairline.
- Sections stack with a top hairline, 82px vertical padding, and a sticky 30px heading.

## Section library

Portfolio sections share one frame, `.library-section`, styled in `packages/ui/src/layout/section/sections.css`. A section does not invent its own palette. It uses the studio canvas, hairline, and accent.

**`library-section`** — Top hairline in `{colors.hairline-studio}`, 56px vertical padding. The heading is `clamp(28px, 3vw, 44px)` with line height 1.15. Body copy is muted with line height 1.8. Links are `{colors.accent}`. Alignment is left unless `data-alignment` is `center` or `right`. The content grid defaults to 3 columns and can be set to 1, 2, or 4 with `data-columns`. Below 700px the grid and masonry collapse to one column.

**`section-prose`** — Each article has 20px vertical padding and a bottom hairline.

**`section-item-value`** — 32px, weight 650. Period labels are 13.6px. Statistic headings (`.section-view-statistics h3`) are 48px in `{colors.accent}`.

**`section-timeline`** — A left hairline. Each item has 16px padding and 16px vertical margin. Step lists use the same item padding.

**`section-masonry`** — Column gap `{spacing.md}`. Each article is a hairline card with 16px radius and 20px padding.

**`section-type-cta`** — Centered. The action is an inline accent outline, 8px radius, padding 12px 20px.

**`section-contact-form`** — Max width 680px, 12px gap. Inputs, the textarea, and the button use the studio surface, a hairline, 8px radius, and 12px padding. Text inherits the page font.

**`section-location`** — The map frame is full width, 400px tall, 12px radius, with no border.

**People and clients** — Team and profile photos are 180px squares, cropped to a circle. Client logos are 120px tall and contained, not cropped.

**Quotes and code** — Blockquotes are italic, with a 3px `{colors.accent}` rule and 20px of inline start padding. `pre` blocks use the studio surface, 12px radius, and 16px padding.

**Video** — Native video is full width, at most 600px tall, with 12px radius.

## Using it

- Reach for `packages/ui` components before adding a one-off control.
- Keep one accent on a page. Cyan is the product accent. Red is for contrast marks and destructive actions.
- Use the spacing and radius tokens. Do not invent a third radius for a button.
- Keep cards, dialogs, and menus flat. Solid buttons use the inset highlight; text, ghost, and outline actions stay flat.
- Swap brand with `data-brand` and theme with `data-theme`. Do not hard-code a new hex for a one-off screen.

## Shared surface implementation

### Assistant surfaces

The homepage composer sits beneath the capabilities strip at a maximum width of
800px. Use ChatComposer, a single rounded surface with one icon-only arrow action;
its accessible name is Send message. Do not nest the old chat textarea panel in
the homepage hero. StudioChatScreen provides the full-page conversation layout:
a quiet workspace sidebar, a centered empty state, and a bottom composer once
the conversation starts. Use semantic background, card, foreground, border and
muted tokens, shared spacing and radius tokens, and a flat hairline surface.
The mobile layout replaces the sidebar with an explicit workspace disclosure.

HeroSurface supplies the shared low-contrast orbit treatment when no image or
video is configured. Authored media keeps its existing overlay behavior.
Example gallery previews are rendered portfolio content, not lazy iframes.

Use `@shared/ui/card`, `@shared/ui/button`, `@shared/ui/input` and
`@shared/ui/textarea` in product compositions. Elevation and focus styling live in
`packages/ui/src/cards/surfaces.css`, loaded with the foundation bundle.
Cards use `interaction="lift"` by default for an accent-tinted hover wash and
a stronger border. Use `interaction="static"` for a preview frame or nested surface
that should stay on the plain card fill. Hover is limited to fine pointers, with matching
focus-within border color.
Reduced motion removes the hover wash and transitions.

Use `Card asChild layout="plain"` around an existing section or article to keep
its semantics and page layout. Existing published palettes use the explicit
`surface="portfolio"` adapter, which maps local card tokens without overwriting
root shadcn tokens. New semantic screens use the default surface.
