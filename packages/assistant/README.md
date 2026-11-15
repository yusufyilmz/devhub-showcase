# Shared assistant and portfolio features

`@shared/assistant` owns assistant models/workflows, chat and companion presentation, portfolio/studio compositions, Fitness proposals, CV rendering, examples and management UI. Applications import shallow public entry points from the [catalog](CATALOG.md).

| Folder                                                                          | Responsibility                                                                |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/models`, `src/services`, `src/messages`                                    | Provider workflows, validated proposals and fixed assistant messages          |
| `src/client`                                                                    | Browser streaming transport                                                   |
| `src/components/chat`, `src/components/companion`, `src/components/fitness`     | Chat state, guide content, proposals and companion presentation               |
| `src/components/portfolio`, `src/components/sections`, `src/components/editors` | Portfolio composition and editing surfaces                                    |
| `src/components/studio`                                                         | Studio workspace, import/settings, examples and managed-portfolio UI          |
| `src/components/cv`, `src/server`, `src/types`, `templates`                     | PDF rendering, reusable server response/metadata builders and template source |

Server workflows and client components have distinct exports: `@shared/assistant/chat` is the backend factory; `@shared/assistant/chat-ui` is presentation. Import CV rendering through `@shared/assistant/cv`. Do not put browser exports in the model root barrel or provider code in a client barrel.

Apps supply verified sessions, cookies, origin checks, environment settings, server actions and authenticated transport. Fitness UI receives request/notification callbacks; proposals remain drafts until explicitly reviewed and saved. Shared code must never import either app. Primitive controls and global styles remain in `@shared/ui`.

Run `pnpm typecheck`, `pnpm test` and `pnpm check:exports`. See the [manual migration guide](../../docs/testing/manual/assistant-package.md) for local and preview checks. Tests use fictional fixtures and stubbed providers; provider credentials and private owner context never belong in browser code or logs.
