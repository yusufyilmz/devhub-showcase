# Tailwind CSS 4

The workspace uses Tailwind CSS 4.3.3 and its matching @tailwindcss/postcss plugin. Both versions are pinned in pnpm-workspace.yaml; package manifests use catalog references. Applications and the UI package reuse the PostCSS configuration exported by @shared/tailwind-config.

Shared semantic colors, spacing and animation tokens live in packages/tailwind-config/theme.css. The existing semantic utility names remain available. Colors use @theme inline so utilities resolve the active portfolio palette on the element, including nested previews and light/dark changes.

The CSS entry in packages/ui/src/globals.css imports Tailwind, the shared tokens and shared component styles. Existing component styles retain their original unlayered precedence, including the padding reset used by expandable card headings. Explicit @source declarations include the web app, feature components, shared UI and shared components. New applications should provide sources for their own app code and can reuse the shared theme CSS and PostCSS configuration.

The old JavaScript Tailwind configurations and v3 @tailwind directives have been removed. Autoprefixer is unnecessary in the v4 pipeline. The unused typography plugin has also been removed. Legacy grow, opacity and outline utilities have been migrated, and bare shadows use shadow-sm to retain their v3 size. Stacked content uses flex gaps to avoid the v4 space-between selector changes. Compatibility base rules preserve default border and placeholder colors.

Tailwind 4 targets Safari 16.4+, Chrome 111+ and Firefox 128+. Browser tests in this repository run desktop Chromium and an emulated mobile Chromium viewport; they do not certify Safari or Firefox.

Validation includes the production build, strict repository checks, unit tests and the full browser suite. A dedicated browser check verifies shared semantic text/background utilities and spacing on an Engineer portfolio in both color modes. Theme screenshots can be compared to the v3 build.

References: https://tailwindcss.com/docs/upgrade-guide and https://tailwindcss.com/docs/detecting-classes-in-source-files.
