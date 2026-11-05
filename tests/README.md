# Vitest support

Colocated tests live next to the code they cover:

- `packages/**/**/*.test.{ts,tsx}` — shared packages (ui, lib, config, auth, and others)
- `apps/my-dev-studio/**/**/*.test.{ts,tsx}` — routes, features, and app-only UI

| Folder           | Contents                                          |
| ---------------- | ------------------------------------------------- |
| `../tools/test/` | Shared fixtures, Vitest setup, mocks, and helpers |

Run the full suite with `pnpm test`, or target one file with:

```sh
pnpm exec vitest run --project unit apps/my-dev-studio/features/home/home-page.test.tsx
```
