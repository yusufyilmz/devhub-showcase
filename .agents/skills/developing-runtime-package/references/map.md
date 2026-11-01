# Runtime package map

Package `@shared/runtime` in `packages/runtime`.

| Export                          | Path                         |
| ------------------------------- | ---------------------------- |
| `@shared/runtime`               | `src/index.ts`               |
| `@shared/runtime/api`           | `src/api/index.ts`           |
| `@shared/runtime/http`          | `src/http/index.ts`          |
| `@shared/runtime/debounced`     | `src/debounced/index.ts`     |
| `@shared/runtime/clipboard`     | `src/clipboard/index.ts`     |
| `@shared/runtime/browser`       | `src/browser/index.ts`       |
| `@shared/runtime/notifications` | `src/notifications/index.ts` |
| `@shared/runtime/user`          | `src/user/index.ts`          |

## Files

| File                                        | Symbol                            |
| ------------------------------------------- | --------------------------------- |
| `src/http/useFetch.ts`                      | `useFetch`                        |
| `src/http/useGet.ts`                        | `useGet`                          |
| `src/http/usePost.ts`                       | `usePost`                         |
| `src/http/usePatch.ts`                      | `usePatch`                        |
| `src/http/usePut.ts`                        | `usePut`                          |
| `src/http/useDelete.ts`                     | `useDelete`                       |
| `src/http/fetchTimeout.ts`                  | Timeout helper used by `useFetch` |
| `src/debounced/useDebouncedFetch.ts`        | `useDebouncedFetch`               |
| `src/debounced/useDebouncedGet.ts`          | `useDebouncedGet`                 |
| `src/debounced/useDebouncedPost.ts`         | `useDebouncedPost`                |
| `src/debounced/useDebouncedPatch.ts`        | `useDebouncedPatch`               |
| `src/api/useApiRequest.ts`                  | `useApiRequest`                   |
| `src/api/useDebouncedApiRequest.ts`         | `useDebouncedApiRequest`          |
| `src/clipboard/useCopyClipboard.ts`         | `useCopyClipboard`                |
| `src/browser/useOutsideClick.ts`            | `useOutsideClick`                 |
| `src/browser/useWindowSize.ts`              | `useWindowSize`                   |
| `src/browser/use-mobile.ts`                 | `useIsMobile`                     |
| `src/notifications/NotificationContext.tsx` | Notification context              |
| `src/notifications/useNotification.ts`      | `useNotification`                 |
| `src/stores/chatStore.ts`                   | Chat client state                 |
| `src/stores/profileStore.ts`                | Profile draft state               |
| `src/stores/userConfigStore.ts`             | Sidebar and chat layout           |
| `src/stores/utils.ts`                       | Store helpers                     |

## Root versus stores entry

`src/index.ts` exports the hooks and the user-config store helpers. Import chat and profile stores from `@shared/runtime/user` unless you have just added them to the root barrel.

## Checks

```sh
pnpm --filter @shared/runtime typecheck
pnpm check:exports
```
