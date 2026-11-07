# `@shared/ui` styles

**Canonical overview:** [DESIGN.md — Stylesheet architecture](../../DESIGN.md#stylesheet-architecture) at the repo root.

Use this file when you are already in `packages/ui/src/styles` and need a quick pointer:

- **Storybook / tokens only:** `@shared/ui/foundation.css`
- **Full app:** `@shared/ui/app.css` or `@shared/ui/globals.css`
- **Tokens:** `tokens/` (aggregator: `tokens/index.css`, export `@shared/ui/shadcn.css`)
- **Component styles:** `components/`, grouped by UI domain and loaded by the owning components.
- **Global bundle:** `portfolio/bundle.css` loads layout, presets and the semantic bridge.
- **Shared control styles:** `components/cards/surfaces.css`, imported by cards and controls.
- **Fitness:** `@shared/ui/fitness.css`, loads the shared foundation before Fitness styles.
- **Storybook demo:** `@shared/ui/storybook-demo-globals.css` and `@shared/ui/storybook-demo.css`.

Root-level `*.css` files beside this document are compatibility shims; see DESIGN.md for the mapping.
