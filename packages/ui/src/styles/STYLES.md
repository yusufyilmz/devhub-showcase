# `@shared/ui` styles

**Canonical overview:** [DESIGN.md — Stylesheet architecture](../../../DESIGN.md#stylesheet-architecture) at the repo root.

Use this file when you are already in `packages/ui/src/styles` and need a quick pointer:

- **Storybook / tokens only:** `@shared/ui/foundation.css`
- **Full app:** `@shared/ui/app.css` or `@shared/ui/globals.css`
- **Tokens:** `tokens/` (aggregator: `tokens/index.css`, export `@shared/ui/shadcn.css`)
- **Portfolio skins:** `portfolio/` (bundle: `portfolio/bundle.css`, export `@shared/ui/legacy.css`)

Root-level `*.css` files beside this document are compatibility shims; see DESIGN.md for the mapping.
