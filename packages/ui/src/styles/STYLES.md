# `@shared/ui` styles

**Canonical overview:** [DESIGN.md — Stylesheet architecture](../../../DESIGN.md#stylesheet-architecture) at the repo root.

Use this file when you are already in `packages/ui/src/styles` and need a quick pointer:

- **Storybook / tokens only:** `@shared/ui/foundation.css`
- **Full app:** `@shared/ui/app.css` or `@shared/ui/globals.css`
- **Tokens:** `tokens/` (aggregator: `tokens/index.css`, export `@shared/ui/shadcn.css`)
- **Component styles:** colocated with their owning UI domain: `../portfolio/portfolio.css`,
  `../sections/sections.css`, `../navigation/chrome.css`, `../display/chat/*.css`,
  `../sections/home-section/examples.css`, and `../forms/login-form/auth-login.css`.
- **Global bundle:** `portfolio/bundle.css` preserves the established cascade order.
- **Centralized styles:** tokens, themes, layout CSS, global resets and shared foundation surfaces.

Root-level `*.css` files beside this document are compatibility shims; see DESIGN.md for the mapping.
