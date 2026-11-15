# Shared test tooling

Private workspace package `@shared/test` owns reusable fixtures, Storybook helpers, Vitest setup and framework mocks. Keep feature-specific tests beside their implementation.

Exports include `@shared/test/setup`, `@shared/test/mocks/next-font-google` and fixture files under `@shared/test/fixtures/*` (include the file extension). Existing `@fixtures/*` aliases resolve to this package's `fixtures/` directory in TypeScript, Vitest and Storybook.

Run `pnpm test` from the repository root. Fixture data is fictional and carries no service credentials. Do not import this package into production application entry points.

Playwright configs import `generateE2EConfig` from `@shared/test/playwright`.
It defaults to desktop Chromium and Pixel 7, finds tests in the app's `e2e`
folder, and captures screenshots and traces on failure. Pass app-specific
server settings, a base URL, and any overrides as a Playwright config.

Build the app before running `pnpm test:e2e:studio` or `pnpm test:e2e:fitness`
from the repository root.
