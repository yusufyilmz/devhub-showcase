# MyDevStudio Storybook

Run from the repository root:

```sh
pnpm --filter storybook-app storybook
```

Open `http://localhost:6006` and select **Design system / Themes / Playground**.
The toolbar selects White, Sand or Aqua, light/dark mode, spacing and radius.
The same attributes apply to the document root so portaled controls share the palette.
Changes do not write portfolio settings or use the portfolio theme storage key.

```sh
pnpm --filter storybook-app build-storybook
```

Stories load `@shared/ui/foundation.css` (tokens + Tailwind, no portfolio bundle).
Full app CSS is `@shared/ui/app.css` / `@shared/ui/globals.css`. Portfolio-only
styles are `@shared/ui/portfolio/bundle.css`.
See `packages/ui/src/styles/STYLES.md`.
used by the Next.js app during migration. It is not loaded into primitive stories.
See [the design system catalog](../../packages/ui/CATALOG.md).

Stories belong beside their components in `packages/ui`.
The `dev` and `build` commands still target the separate Vite shell; use the
Storybook commands above for the component explorer.
