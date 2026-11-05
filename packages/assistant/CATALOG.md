# Assistant catalog

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
