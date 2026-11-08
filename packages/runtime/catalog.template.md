# Runtime catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "storage" --package @shared/runtime --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/runtime`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

Browser helpers for `@shared/runtime`. These hooks do not choose an API URL or authorize a user.

| Export                          | Path                | Use                                           |
| ------------------------------- | ------------------- | --------------------------------------------- |
| `@shared/runtime`               | `src/index.ts`      | Fetch, debounce, clipboard, and browser hooks |
| `@shared/runtime/api`           | `src/api`           | `useApiRequest`, `useDebouncedApiRequest`     |
| `@shared/runtime/http`          | `src/http`          | `useFetch` and method hooks                   |
| `@shared/runtime/debounced`     | `src/debounced`     | Debounced fetch hooks                         |
| `@shared/runtime/clipboard`     | `src/clipboard`     | `useCopyClipboard`                            |
| `@shared/runtime/browser`       | `src/browser`       | Outside click, window size, mobile            |
| `@shared/runtime/notifications` | `src/notifications` | Notification context                          |
| `@shared/runtime/user`          | `src/user`          | Chat, profile, and user config stores         |
| `@shared/runtime/chat`          | `src/chat`          | Portfolio chat state                          |
| `@shared/runtime/storage`       | `src/storage`       | Browser storage keys and feature adapters     |

## Browser storage

`browserStorage.ts` defines the shared namespace, version and safe access to
local and session storage. Import the feature adapter from
`@shared/runtime/storage`.

- `themeStorage` stores mode and appearance in local storage. `themeBootstrapScript` applies them before paint, and `useThemeStore` exposes them in React.
- `userStorage` persists the display cache for `useUserConfigStore` in local storage. Authorization remains on the server.
- `companionStorage` stores dock position and feature-tip preferences in local storage.
- `chatStorage` stores chat by portfolio and revision and carries pending assistant prompts in session storage.
- `draftStorage` stores draft recovery per user and portfolio in session storage.

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
