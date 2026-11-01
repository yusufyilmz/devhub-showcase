# tsdown

Library packages run [`tsdown`](https://tsdown.dev) via `pnpm build`, using `defineLibraryConfig()` from `library.ts`.

- Output: `dist/` (ESM). Turbo caches `dist/**` for package builds.
- Workspace `package.json` exports still target `src/` for development; switch exports to `dist` when you publish a package.
- Type declarations: use `pnpm typecheck` (`tsc --noEmit`); dts emit is off by default to avoid Storybook / Next-only edge cases in declaration generation.
