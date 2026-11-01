# Vitest support

Colocated tests live next to the code they cover:

- `packages/**/**/*.test.{ts,tsx}` — shared packages (components, lib, config, auth, and others)
- `apps/my-dev-studio/**/**/*.test.{ts,tsx}` — routes, features, and app-only UI

| Folder     | Contents                         |
| ---------- | -------------------------------- |
| `support/` | Vitest setup, mocks, and helpers |

Run the full suite with `pnpm test`, or target one file with:

```sh
pnpm exec vitest run --project unit packages/components/src/studio/home-page.test.tsx
```
