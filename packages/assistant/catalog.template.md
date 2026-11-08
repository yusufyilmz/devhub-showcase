# Assistant catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "portfolio" --package @shared/assistant --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/assistant`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

Focused writing and section feedback run through PortfolioEditModel. The focused-assistant helper sends selected source text only and reconstructs validated proposals. See docs/features/assistant-guidance.md for review, configuration and publication snapshot behavior.

Provider configuration and optional text streaming live in
src/services/provider.ts (AssistantService). Model classes own task context and
validation; use the service for provider access, not a second business workflow.
See docs/features/assistant-configuration.md for saved agents and external prompts.
Text budgets are checked in src/services/token-budget.ts before generation. See
docs/features/assistant-rollout.md for the rollout and copy-ready prompts.

Portfolio and editing assistants for `@shared/assistant`. Models call a provider. They do not authorize a user or write a profile.

| Export                               | Path                                       | Use                                                        |
| ------------------------------------ | ------------------------------------------ | ---------------------------------------------------------- |
| `@shared/assistant`                  | `src/index.ts`                             | Chat, edit, and CV import models, plus formatters          |
| `@shared/assistant/fitness`          | `src/models/fitness-assistant.ts`          | Private Fitness plan and reminder proposals                |
| `@shared/assistant/fitness-contract` | `src/models/fitness-assistant-contract.ts` | Shared Fitness proposal schemas                            |
| `@shared/assistant/models/*`         | `src/models/*`                             | One model file                                             |
| `@shared/assistant/services/*`       | `src/services/*`                           | Classifier, formatter, processor, referral, and summarizer |

| Symbol                                                             | Use                                                |
| ------------------------------------------------------------------ | -------------------------------------------------- |
| `PortfolioChatModel`                                               | Visitor chat over published knowledge              |
| `PortfolioEditModel`                                               | Owner draft proposals                              |
| `proposeInterviewPrep`                                             | Private interview brief using selected CV evidence |
| `CvImportModel`                                                    | Reviewed extraction from an uploaded CV            |
| `createCVModel`, `formatAllCV`, `formatters`                       | CV text prepared for a model                       |
| `MessageProcessor`                                                 | Chat reply classification                          |
| `greetingMessage`, `failureMessage`, and the other message helpers | Fixed assistant copy                               |

Chat presentation lives in `packages/assistant/src/components/chat`. Use `@shared/assistant/chat-ui`, `@shared/assistant/chat-section`, `@shared/assistant/chat/assistant`, `@shared/assistant/chat/portfolio`, or `@shared/assistant/chat/premium`. Shared portfolio chat workflows live in this package; app features bind configuration and browser/server transport.

## Shared backend entry points

| Export                              | Implementation                           | Responsibility                                                        |
| ----------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `@shared/assistant/chat`            | `src/services/main-portfolio-chat.ts`    | Main portfolio context/publication checks and rate limits             |
| `@shared/assistant/premium-chat`    | `src/services/premium-portfolio-chat.ts` | Pro eligibility, usage reservations, answers and publication rechecks |
| `@shared/assistant/fitness-context` | `src/services/fitness-context.ts`        | Bounded task, workout and reminder context                            |
| `@shared/assistant/workout-draft`   | `src/services/workout-draft.ts`          | Validated exercise/set draft additions without persistence            |

Chat factories receive a configuration callback. No shared backend imports app environment modules. Chat and workout draft tests are colocated under `src/services`.

## Client surfaces and portfolio composition

| Export                                 | Source                                                        | Responsibility                                                              |
| -------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `@shared/assistant/chat-ui`            | `src/components/chat/index.ts`                                | Chat controls, screen and panel composition                                 |
| `@shared/assistant/visitor-chat`       | `src/components/chat/portfolio-visitor-chat.tsx`              | Visitor session/history, streaming and injected premium server action       |
| `@shared/assistant/studio-chat`        | `src/components/chat/studio-chat.tsx`                         | Private draft proposal and save screen                                      |
| `@shared/assistant/stream-client`      | `src/client/portfolio-stream.ts`                              | Portfolio answer streaming and cancellation                                 |
| `@shared/assistant/agent-companion`    | `src/components/chat/agent-companion/index.ts`                | Companion presentation and progress hooks                                   |
| `@shared/assistant/companion-guides`   | `src/components/companion/guides.ts`                          | Studio, portfolio and Fitness guide content and observed progress           |
| `@shared/assistant/studio-companion`   | `src/components/companion/studio-companion.tsx`               | Studio navigation companion                                                 |
| `@shared/assistant/fitness-ui`         | `src/components/fitness/index.ts`                             | Plan assistant, companion overlay, proposals and editor target contract     |
| `@shared/assistant/studio-workspace`   | `src/components/studio/workspace/index.ts`                    | Profile editor, draft preview, publication, history and private CV versions |
| `@shared/assistant/studio`             | `src/components/studio/index.ts`                              | AI editors, CV import/review and PDF settings                               |
| `@shared/assistant/portfolio`          | `src/components/portfolio/index.ts`                           | Reusable portfolio/editor surfaces                                          |
| `@shared/assistant/engineer-portfolio` | `src/components/portfolio/engineer-portfolio.tsx`             | Engineer portfolio view with an injected send-message callback              |
| `@shared/assistant/portfolio-preview`  | `src/components/portfolio/portfolio-preview/index.ts`         | Responsive previews                                                         |
| `@shared/assistant/sections`           | `src/components/sections/index.ts`                            | Portfolio and homepage section compositions                                 |
| `@shared/assistant/sections/studio`    | `src/components/sections/studio/index.ts`                     | Section editor compositions                                                 |
| `@shared/assistant/editor`             | `src/components/editors/index.ts`                             | Shared collection/content/options editing                                   |
| `@shared/assistant/examples`           | `src/components/studio/examples/index.ts`                     | Example carousel                                                            |
| `@shared/assistant/examples-data`      | `src/components/studio/examples/data.ts`                      | Fictional examples and lookup helpers, separate from UI imports             |
| `@shared/assistant/management-ui`      | `src/components/studio/management/index.ts`                   | Managed profile create/edit/transfer composition                            |
| `@shared/assistant/password-gate`      | `src/components/portfolio/access/portfolio-password-gate.tsx` | Public password entry and unlock interaction                                |

Fitness components receive authenticated `request` and device `notify` callbacks from the app. Visitor chat receives its premium server action from the route. Shared code never imports app source, app env modules or server session helpers. Primitive controls, theme tokens and styles remain in `@shared/ui`; moved component styles use explicit public stylesheet paths.

## Portfolio server helpers and CV rendering

| Export                                 | Source                                  | Responsibility                                                   |
| -------------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `@shared/assistant/portfolio-branding` | `src/server/portfolio-branding.ts`      | Escaped SVG initials and accent colors                           |
| `@shared/assistant/portfolio-metadata` | `src/server/portfolio-metadata.ts`      | Metadata builder receiving platform defaults                     |
| `@shared/assistant/structured-data`    | `src/server/profile-structured-data.ts` | Profile structured data                                          |
| `@shared/assistant/cv-response`        | `src/server/cv-response.ts`             | No-cache CV download response factory with indexing headers      |
| `@shared/assistant/cv`                 | `src/components/cv/index.ts`            | `createCvData`, `createCvDefinition`, `renderCv` and `cvHelpers` |
| `@shared/assistant/cv.hbs`             | `templates/cv.json.hbs`                 | Handlebars source typed by `src/types/cv-template.d.ts`          |

PDF data, definition, rendering, ATS content and section ordering are separate colocated modules and tests. Fonts are in memory and local/remote asset access is disabled. CV projection, private versions and public snapshots retain separate visibility rules. The former `@shared/templates` package has been removed; import these entry points directly.

App-specific factory bindings are colocated with pages/routes under `apps/my-dev-studio/app`. Private sibling files hold shared request/session bindings. The former studio, home, reviews, portfolio, platform and chat feature directories are removed; reusable logic lives in this package or `@shared/lib`. See [migration verification](../../docs/testing/manual/assistant-package.md).

## Generated package reference

<!-- catalog:exports -->

<!-- catalog:scripts -->

<!-- catalog:dependencies -->
