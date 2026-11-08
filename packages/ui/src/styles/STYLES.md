# `@shared/ui` styles

**Canonical overview:** [DESIGN.md — Stylesheet architecture](../../DESIGN.md#stylesheet-architecture) at the repo root.

This folder keeps the shared token and foundation layers:

- **Storybook / tokens only:** `@shared/ui/foundation.css`
- **Full app:** `@shared/ui/app.css` (`@shared/ui/globals.css` is the same file)
- **Tokens:** `tokens/` (aggregator: `tokens/index.css`, export `@shared/ui/shadcn.css`)
- **Foundation:** `foundation/` (theme aliases, platform RGB, product tokens)

Component, portfolio, chat, fitness, and Storybook demo styles live next to the components that load them. The app entry still pulls in `src/layout/portfolio/bundle.css`. Shared control surfaces live in `src/cards/surfaces.css`. Fitness styles live in `apps/my-fitness-app/app/fitness.css`. The Storybook demo shell lives in `apps/storybook-app/src/demo.css` and `demo-globals.css`.
