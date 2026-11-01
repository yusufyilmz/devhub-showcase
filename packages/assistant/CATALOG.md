# Assistant catalog

Provider configuration and optional text streaming live in
src/services/provider.ts (AssistantService). Model classes own task context and
validation; use the service for provider access, not a second business workflow.
See docs/features/assistant-configuration.md for saved agents and external prompts.

Portfolio and editing assistants for `@shared/assistant`. Models call a provider. They do not authorize a user or write a profile.

| Export                         | Path             | Use                                                        |
| ------------------------------ | ---------------- | ---------------------------------------------------------- |
| `@shared/assistant`            | `src/index.ts`   | Chat, edit, and CV import models, plus formatters          |
| `@shared/assistant/models/*`   | `src/models/*`   | One model file                                             |
| `@shared/assistant/services/*` | `src/services/*` | Classifier, formatter, processor, referral, and summarizer |

| Symbol                                                             | Use                                     |
| ------------------------------------------------------------------ | --------------------------------------- |
| `PortfolioChatModel`                                               | Visitor chat over published knowledge   |
| `PortfolioEditModel`                                               | Owner draft proposals                   |
| `CvImportModel`                                                    | Reviewed extraction from an uploaded CV |
| `createCVModel`, `formatAllCV`, `formatters`                       | CV text prepared for a model            |
| `MessageProcessor`                                                 | Chat reply classification               |
| `greetingMessage`, `failureMessage`, and the other message helpers | Fixed assistant copy                    |
