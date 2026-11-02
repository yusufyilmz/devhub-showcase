# Runtime catalog

The user store persists validated themePreferences alongside activeMode and the
display user. Preferences include density, brand/accent, border, shadow, radius,
scale, typography and motion choices. Legacy ui-theme and data-* preferences
migrate into the canonical record; clearing the display user retains appearance.

Browser helpers for `@shared/runtime`. These hooks do not choose an API URL or authorize a user.

| Export                          | Path                                  | Use                                             |
| ------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `@shared/runtime`               | `src/index.ts`                        | Fetch, debounce, clipboard, and browser hooks   |
| `@shared/runtime/api`           | `src/api`                             | `useApiRequest`, `useDebouncedApiRequest`       |
| `@shared/runtime/http`          | `src/http`                            | `useFetch` and method hooks                     |
| `@shared/runtime/debounced`     | `src/debounced`                       | Debounced fetch hooks                           |
| `@shared/runtime/clipboard`     | `src/clipboard`                       | `useCopyClipboard`                              |
| `@shared/runtime/browser`       | `src/browser`                         | Outside click, window size, mobile              |
| `@shared/runtime/notifications` | `src/notifications`                   | Notification context                            |
| `@shared/runtime/user`          | `src/user`                            | Chat, profile, and user config stores           |
| `@shared/runtime/user`          | `src/stores/userConfigPersistence.ts` | Theme key, legacy read, and before-paint script |

## User configuration

`useUserConfigStore` from `@shared/runtime/user` owns `activeMode`
(`light`, `dark`, `system`, or unset before initial selection) and `user`
(id, name, optional email/avatar). `setActiveMode`, `setUser`, `clearUser`, and
`reset` are its actions. It keeps the existing `buzzy-userconfig-store` storage
key with schema version 2 and migrates version 1. Unused sidebar, chat sizing,
VBA, CAPTCHA, Nginx, file-browser and other legacy flags are removed.

The provider imports preferences from the temporary `mydevstudio-storage`
record and older page keys, then removes the temporary record only after the
canonical record is saved. `clearUser` keeps the mode. Only whitelisted display
fields are cached; authorization stays on the server. Storage is optional and
hydration is explicit so server rendering does not read browser state.
