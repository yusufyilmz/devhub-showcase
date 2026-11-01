---
name: developing-trello-package
description: Change the Trello board UI and client in @shared/trello. Use when editing Trello services, board hooks, the board store, or board, card, list, and comment screens in packages/trello.
---

# Developing the Trello package

`packages/trello` is `@shared/trello`. It owns a Trello board client, Zustand state, and board screens. It is not part of the portfolio document, the studio save path, or CV rendering. Do not route profile fields through Trello, and do not import this package into a published portfolio page to store owner data.

Read [the file map](references/map.md) and [packages/trello/CATALOG.md](../../../packages/trello/CATALOG.md).

## Public surface

`src/index.ts` exports services, hooks, the store, constants, and types. Board screens under `src/components` are not all re-exported from the root. The commented component exports in `src/index.ts` stay commented until a caller has a real subpath and a catalog row. `src/index-stub.ts` is not the package entry. `package.json` `main` is `src/index.ts`. There is no `exports` map. Add one if you introduce a subpath, and run `pnpm check:exports`.

| Export                                                                                | Use                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------- |
| `TrelloClient`, `TrelloService`                                                       | HTTP access to the Trello API            |
| `TrelloBoardService`, `TrelloCardService`, `TrelloListService`, `TrelloMemberService` | Board, card, list, and member operations |
| `TrelloApiService`                                                                    | `BoardService` alias                     |
| `useTrelloBoards`, `useTrelloBoardView`                                               | Board data hooks                         |
| `useTrelloStore`, `trelloActions`, `trelloSelectors`                                  | Client board state                       |

Screens live in `src/components/board`, `cards`, `integration`, `layout`, `pages`, and `ui`. Import them from those files only inside this package unless you add a public export on purpose.

## Client and credentials

`TRELLO_CONFIG.BASE_URL` is `https://api.trello.com/1`. `DEFAULT_TRELLO_CONFIG` reads `TRELLO_API_KEY` and `TRELLO_API_TOKEN`. `CLIENT_TRELLO_CONFIG` reads `NEXT_PUBLIC_TRELLO_API_KEY` and `NEXT_PUBLIC_TRELLO_API_TOKEN`.

Do not add new secrets with a `NEXT_PUBLIC_` prefix. A public token is visible in the browser. Do not copy that pattern for Supabase service role, Stripe, OpenAI, or Redis. Do not log keys or tokens. `TrelloClient` is written to sanitize them in development logs. Keep that sanitizing if you change the logger calls. Do not log full response bodies that contain member email addresses or tokens.

The configured scope string is `read,write,account`. Do not widen it for a UI-only change. Rate-limit retries inside `TrelloClient` back off on HTTP 429. Keep that behavior rather than tight-looping the API.

This package does not authorize a MyDevStudio user. If a screen is mounted inside the app, the app route decides who can open it. Trello credentials are integration credentials, not portfolio ownership.

## UI boundaries

Use `@shared/ui` primitives and tokens for new board UI. Local pieces in `src/components/ui` are board-specific layout, not a second control kit. `TrelloErrorBoundary` lives in `src/components/layout`.

`useTrelloStore` is client state for the open board. It is not the portfolio profile store in `@shared/runtime`. Do not write portfolio revisions from a Trello action.

Comments UI is `TrelloCardComments` and `TrelloArticleComments` under `src/components/integration`. Article metadata helpers are `src/utils/articleMetadata.ts`.

## Tests and build

The package script `test` runs Vitest. Colocate `file.test.ts` next to the source. Stub `fetch`. Do not call `api.trello.com` from unit tests. The package also has `build-storybook` and `generate:component`. Prefer a story next to a screen only when Storybook for this package is actually wired. The shared Storybook app loads stories from `@shared/ui`, not from this package. Do not move a Trello screen into `@shared/ui` to make it appear there.

```sh
pnpm --filter @shared/trello typecheck
pnpm --filter @shared/trello lint
```

`typecheck` uses `tsc --noEmit --pretty`. Fix types in the Trello package. Do not relax the shared TypeScript config.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the utils package](../developing-utils-package/SKILL.md)
