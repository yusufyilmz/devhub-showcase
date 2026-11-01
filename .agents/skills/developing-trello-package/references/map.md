# Trello package map

Package `@shared/trello` in `packages/trello`. Root export is `src/index.ts`.

## Services

| File                            | Export                                            |
| ------------------------------- | ------------------------------------------------- |
| `src/services/TrelloClient.ts`  | `TrelloClient`                                    |
| `src/services/TrelloService.ts` | `TrelloService`                                   |
| `src/services/TrelloBoard.ts`   | `TrelloBoardService`                              |
| `src/services/TrelloCard.ts`    | `TrelloCardService`                               |
| `src/services/TrelloList.ts`    | `TrelloListService`                               |
| `src/services/TrelloMember.ts`  | `TrelloMemberService`                             |
| `src/services/BoardService.ts`  | `BoardService`, re-exported as `TrelloApiService` |

## State and hooks

| File                               | Export                                               |
| ---------------------------------- | ---------------------------------------------------- |
| `src/hooks/useTrelloBoards.ts`     | `useTrelloBoards`                                    |
| `src/hooks/useTrelloBoardView.ts`  | `useTrelloBoardView`                                 |
| `src/hooks/useTrelloStoreReady.ts` | Store readiness hook                                 |
| `src/stores/trelloStore.ts`        | `useTrelloStore`, `trelloActions`, `trelloSelectors` |
| `src/stores/commentStore.ts`       | Comment client state                                 |
| `src/constants.ts`                 | `TRELLO_CONFIG` and credential readers               |
| `src/types.ts`                     | Public types                                         |

## Screens

| Path                             | Contains                                         |
| -------------------------------- | ------------------------------------------------ |
| `src/components/board`           | `TrelloBoard`, background, header, sidebar, view |
| `src/components/cards`           | Card, list, detail modal, boards grid            |
| `src/components/integration`     | Card and article comments                        |
| `src/components/layout`          | `TrelloErrorBoundary`                            |
| `src/components/pages`           | `TrelloBoardPage`, `TrelloBoardListPage`         |
| `src/components/ui`              | Board-local layout pieces                        |
| `src/utils/boardSurfaceStyle.ts` | Board surface style                              |
| `src/utils/articleMetadata.ts`   | Article metadata                                 |

## Credential names

- `TRELLO_API_KEY`
- `TRELLO_API_TOKEN`
- `NEXT_PUBLIC_TRELLO_API_KEY`
- `NEXT_PUBLIC_TRELLO_API_TOKEN`

Do not add further `NEXT_PUBLIC_` secrets. Portfolio credentials do not belong in this package.

## Checks

```sh
pnpm --filter @shared/trello typecheck
pnpm --filter @shared/trello lint
```
