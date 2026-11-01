# Content package map

Package `@shared/content` in `packages/content`.

| Path                     | Symbol                  | Use                                  |
| ------------------------ | ----------------------- | ------------------------------------ |
| `src/home/faq.ts`        | `homeFaq`               | Homepage questions and answers       |
| `src/index.ts`           | re-exports `homeFaq`    | The only public entry                |
| `package.json` `exports` | `"."` to `src/index.ts` | Import `@shared/content`             |
| `CATALOG.md`             | inventory               | Update when a public symbol is added |

## Nearby copy that is not this package

| Words                                 | Package             | Path                                 |
| ------------------------------------- | ------------------- | ------------------------------------ |
| Profile defaults and site chrome copy | `@shared/config`    | `src/copy`, `src/profile/profile.ts` |
| Portfolio and CV labels               | `@shared/config`    | `src/portfolio/languages.ts`         |
| Fixed assistant replies               | `@shared/assistant` | `src/messages`                       |
| Home page layout and session links    | `my-dev-studio`     | `features/home`                      |

## Checks

```sh
pnpm --filter @shared/content typecheck
pnpm check:exports
```
