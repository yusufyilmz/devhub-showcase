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

Stories load the semantic `@shared/design-system/globals.css` entry. The old
portfolio stylesheet is an explicit `@shared/design-system/legacy.css` entry
used by the Next.js app during migration. It is not loaded into primitive stories.
See [the design system catalog](../../packages/design-system/CATALOG.md).

Stories belong beside their components in `packages/ui` or `packages/components`.
The `dev` and `build` commands still target the separate Vite shell; use the
Storybook commands above for the component explorer.
