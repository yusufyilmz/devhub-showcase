---
name: developing-runtime-package
description: Change shared browser hooks and client stores in @shared/runtime.
  Use when editing useFetch, debounced requests, clipboard, viewport or
  outside-click hooks, notifications, or the chat, profile, and user-config
  stores in packages/runtime.
---

# Developing the runtime package

`packages/runtime` is `@shared/runtime`. It owns browser hooks for fetch, debounce, clipboard, viewport, outside click, notifications, and small client stores. These hooks do not choose an API URL, authorize a user, or own the saved profile.

Read [the file map](references/map.md) and [packages/runtime/CATALOG.md](../../../packages/runtime/CATALOG.md).

The caller passes the URL. A studio screen in `@shared/ui` receives that URL, or a request function, from `apps/my-dev-studio/features`. Do not hard-code `/api/admin/profile` or any other app path in this package.

## Hooks

| Entry                           | Hooks                                                                           | Rule                                                             |
| ------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `@shared/runtime/http`          | `useFetch`, `useGet`, `usePost`, `usePatch`, `usePut`, `useDelete`              | The caller supplies the URL and method behavior                  |
| `@shared/runtime/debounced`     | `useDebouncedFetch`, `useDebouncedGet`, `useDebouncedPost`, `useDebouncedPatch` | Debounce the request. Do not drop a revision the server rejected |
| `@shared/runtime/api`           | `useApiRequest`, `useDebouncedApiRequest`                                       | Same URL rule                                                    |
| `@shared/runtime/clipboard`     | `useCopyClipboard`                                                              | Copy text the caller passes                                      |
| `@shared/runtime/browser`       | `useOutsideClick`, `useWindowSize`, `useIsMobile`                               | Layout signals only                                              |
| `@shared/runtime/notifications` | Notification context and `useNotification`                                      | Transient UI messages                                            |

`useFetch` logs through `@shared/utils/client-logger`. Do not log request or response bodies, tokens, CV text, or prompts. The hook has loose response typing in places. New code should type the payload the caller expects. Do not introduce another `any` to silence a check, and do not weaken the TypeScript config.

A 401 or 403 from the server is an authorization result. The hook may surface the status. It must not retry with a different user id or strip the origin check. Revision conflicts stay visible to the editor so the owner can reload. Do not auto-retry a save by omitting the revision.

## Stores

| Store             | File                            | Holds                       |
| ----------------- | ------------------------------- | --------------------------- |
| Chat store        | `src/stores/chatStore.ts`       | Client chat UI state        |
| Profile store     | `src/stores/profileStore.ts`    | Draft state on the client   |
| User config store | `src/stores/userConfigStore.ts` | Sidebar and chat dimensions |

The root export currently re-exports the user-config helpers (`useUserConfigStore`, `getSidebarCollapsed`, `getChatDimensions`) plus the hooks. Chat and profile stores are exported from `@shared/runtime/user`. `@shared/runtime/user-config` exports the storage key and `userConfigThemeScript` without the client store, so a server layout can render the before-paint script. Check `src/stores/index.ts` and `src/index.ts` before importing a store from the package root.

The profile store is a draft cache. The saved document is whatever `ProfileService` last wrote. Do not treat the store as proof of publication or ownership. Hydrate it from the snapshot the app loaded. Discard it when the server returns `ProfileConflictError` rather than pushing the stale draft over the newer revision.

## Add a hook

1. Put it in the existing folder that matches the job. Add a folder only for a new kind of browser helper.
2. Export it from that folder's `index.ts`.
3. Re-export it from `src/index.ts` when callers should import `@shared/runtime`.
4. Add the symbol to `CATALOG.md`.
5. Keep React hooks free of server-only imports. `src/index.ts` is imported by client components.
6. Colocate `hook.test.tsx` when the hook changes request timing, error mapping, or store updates.

The package depends on `@shared/config`, `@shared/lib`, `@shared/utils`, and Zustand. Use those for types and helpers. Do not import `apps/my-dev-studio`. Do not add a second HTTP stack beside `useFetch` for the same call.

## Verification

```sh
pnpm --filter @shared/runtime typecheck
pnpm exec vitest run --project unit packages/runtime
pnpm --filter my-dev-studio dev
```

When a hook backs an editor control, exercise that control in the browser: type, save, and confirm a failed request leaves the draft in place. Check a narrow viewport when `useIsMobile` or `useWindowSize` behavior changes.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the utils package](../developing-utils-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
