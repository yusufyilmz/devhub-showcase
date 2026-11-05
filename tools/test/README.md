# Shared test tooling

Private workspace package `@shared/test` owns reusable fixtures, Storybook helpers, Vitest setup and framework mocks. Keep feature-specific tests beside their implementation.

Exports include `@shared/test/setup`, `@shared/test/mocks/next-font-google` and fixture files under `@shared/test/fixtures/*` (include the file extension). Existing `@fixtures/*` aliases resolve to this package's `fixtures/` directory in TypeScript, Vitest and Storybook.

Run `pnpm test` from the repository root. Fixture data is fictional and carries no service credentials. Do not import this package into production application entry points.
