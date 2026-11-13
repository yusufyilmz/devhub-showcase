<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# Runtime catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "storage" --package @shared/runtime --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/runtime`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

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

| Import                          | Source / condition             | Declared symbols                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/runtime`               | `./src/index.ts`               | `type DebouncedFetchProps`, `type DebouncedFetchReturn`, `type FetchProps`, `type FetchReturn`, `type UseApiRequestProps`, `type UseApiRequestReturn`, `type UseDebouncedApiRequestProps`, `type UseDebouncedApiRequestReturn`, `useApiRequest`, `useCopyClipboard`, `useDebouncedApiRequest`, `useDebouncedFetch`, `useDebouncedGet`, `useDebouncedPatch`, `useDebouncedPost`, `useDelete`, `useFetch`, `useGet`, `useIsMobile`, `useOutsideClick`, `usePatch`, `usePost`, `usePut`, `useThemeStore`, `useUserConfigStore`, `useWindowSize` |
| `@shared/runtime/api`           | `./src/api/index.ts`           | `type UseApiRequestProps`, `type UseApiRequestReturn`, `type UseDebouncedApiRequestProps`, `type UseDebouncedApiRequestReturn`, `useApiRequest`, `useDebouncedApiRequest`                                                                                                                                                                                                                                                                                                                                                                    |
| `@shared/runtime/browser`       | `./src/browser/index.ts`       | `useIsMobile`, `useOutsideClick`, `useWindowSize`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `@shared/runtime/chat`          | `./src/chat/index.ts`          | `ChatContext`, `createChatStore`, `type ChatIdentity`, `type ChatState`, `useAddMessage`, `useChatMessages`, `useChatState`                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `@shared/runtime/clipboard`     | `./src/clipboard/index.ts`     | `useCopyClipboard`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@shared/runtime/debounced`     | `./src/debounced/index.ts`     | `useDebouncedFetch`, `useDebouncedGet`, `useDebouncedPatch`, `useDebouncedPost`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `@shared/runtime/http`          | `./src/http/index.ts`          | `type DebouncedFetchProps`, `type DebouncedFetchReturn`, `type FetchProps`, `type FetchReturn`, `type UseApiRequestProps`, `type UseApiRequestReturn`, `type UseDebouncedApiRequestProps`, `type UseDebouncedApiRequestReturn`, `useApiRequest`, `useDebouncedApiRequest`, `useDebouncedFetch`, `useDebouncedGet`, `useDebouncedPatch`, `useDebouncedPost`, `useFetch`                                                                                                                                                                       |
| `@shared/runtime/notifications` | `./src/notifications/index.ts` | `NotificationContext`, `type NotificationContextProps`, `type NotificationType`, `useNotification`                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@shared/runtime/storage`       | `./src/storage/index.ts`       | `accountPreferenceSession`, `chatStorage`, `cleanThemePreferences`, `companionStorage`, `draftStorage`, `storage`, `themeBootstrapScript`, `themeOptions`, `themePreferenceAliases`, `themeStorage`, `type StoredUser`, `type ThemeMode`, `type ThemePreferences`, `type TipSettings`, `type VisitorMessage`, `userStorage`                                                                                                                                                                                                                  |
| `@shared/runtime/studio`        | `./src/studio/index.ts`        | `StudioRequestContext`, `defaultStudioRequest`, `type StudioRequest`, `useStudioRequest`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@shared/runtime/user`          | `./src/user/index.ts`          | `type StoredUser`, `useThemeStore`, `useUserConfigStore`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script         | Command                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `build`        | `tsdown`                                                                  |
| `clean`        | `node -e "require('node:fs').rmSync('dist',{recursive:true,force:true})"` |
| `format`       | `biome format --write .`                                                  |
| `format:check` | `biome format .`                                                          |
| `lint`         | `biome lint .`                                                            |
| `lint:check`   | `biome lint .`                                                            |
| `lint:fix`     | `biome lint --write .`                                                    |
| `typecheck`    | `tsc --noEmit`                                                            |
| `types:check`  | `pnpm typecheck`                                                          |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/env`               | `workspace:*`    | dependencies    |
| `@shared/lib`               | `workspace:*`    | dependencies    |
| `@shared/utils`             | `workspace:*`    | dependencies    |
| `react`                     | `catalog:`       | dependencies    |
| `zustand`                   | `catalog:`       | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `@types/react-dom`          | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
