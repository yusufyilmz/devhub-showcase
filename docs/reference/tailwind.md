# Tailwind CSS 4

The workspace uses Tailwind CSS 4.3.5. `tailwindcss`, `@tailwindcss/postcss`, and `@tailwindcss/vite` are pinned in pnpm-workspace.yaml; package manifests use catalog references.

Next.js apps build with webpack, so they keep the PostCSS plugin. `my-dev-studio` and `my-fitness-app` load the configuration exported by `@shared/ui`. Storybook is Vite, so `apps/storybook-app` uses `@tailwindcss/vite` in `vite.config.ts` and does not load the PostCSS plugin. Storybook reads that same Vite config.

Shared semantic colors, spacing and animation tokens live in packages/design-system/theme.css. The shadcn and Radix semantic theme lives in packages/design-system/shadcn.css. Both are exported by @shared/ui. The existing semantic utility names remain available. Colors use @theme inline so utilities resolve the active portfolio palette on the element, including nested previews and light/dark changes.

The CSS entry in packages/ui/src/globals.css imports Tailwind, the shared tokens and shared component styles. Existing component styles retain their original unlayered precedence, including the padding reset used by expandable card headings. Explicit @source declarations include the web app, feature components, shared UI and shared components. New applications should provide sources for their own app code and can reuse the shared theme CSS. New Next.js applications can reuse the PostCSS configuration. New Vite applications should add `@tailwindcss/vite` and should not also load the PostCSS plugin.

The old JavaScript Tailwind configurations and v3 @tailwind directives have been removed. Autoprefixer is unnecessary in the v4 pipeline. The unused typography plugin has also been removed. Earlier grow, opacity and outline utilities have been migrated, and bare shadows use shadow-sm to retain their v3 size. Stacked content uses flex gaps to avoid the v4 space-between selector changes. Compatibility base rules preserve default border and placeholder colors.

Tailwind 4 targets Safari 16.4+, Chrome 111+ and Firefox 128+. Browser tests in this repository run desktop Chromium and an emulated mobile Chromium viewport; they do not certify Safari or Firefox.

Validation includes the production build, strict repository checks, unit tests and the full browser suite. A dedicated browser check verifies shared semantic text/background utilities and spacing on an Engineer portfolio in both color modes. Theme screenshots can be compared to the v3 build.

References: <https://tailwindcss.com/docs/upgrade-guide> and <https://tailwindcss.com/docs/detecting-classes-in-source-files>.
