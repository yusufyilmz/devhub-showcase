# Trello catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "board" --package @shared/trello --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/trello`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

Trello board UI and client services for `@shared/trello`. The package root exports services, hooks, stores, constants, and types. Board screens live under `src/components` and are not all re-exported from the root.

| Area         | Path                         | Use                                      |
| ------------ | ---------------------------- | ---------------------------------------- |
| Package root | `src/index.ts`               | Services, hooks, store, constants, types |
| Board        | `src/components/board`       | `TrelloBoard`, background, and sidebar   |
| Cards        | `src/components/cards`       | `TrelloCard`, list, and detail modal     |
| Integration  | `src/components/integration` | Card and article comments                |
| Layout       | `src/components/layout`      | `TrelloErrorBoundary`                    |
| Pages        | `src/components/pages`       | `TrelloBoardPage`                        |
| Local UI     | `src/components/ui`          | Board-local layout pieces                |

| Symbol                                     | Use                        |
| ------------------------------------------ | -------------------------- |
| `TrelloClient`, `TrelloService`            | Trello API access          |
| `TrelloBoardService`, `TrelloCardService`  | Board and card operations  |
| `TrelloListService`, `TrelloMemberService` | List and member operations |
| `useTrelloBoards`, `useTrelloBoardView`    | Board data hooks           |
| `useTrelloStore`                           | Board client state         |

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
