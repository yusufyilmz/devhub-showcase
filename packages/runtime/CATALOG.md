# Runtime catalog

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
| `@shared/runtime/stores`        | `src/stores`        | Chat, profile, and user config stores         |
