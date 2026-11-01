# Assistant package map

Package `@shared/assistant` in `packages/assistant`.

## Root exports from `src/index.ts`

- Message helpers from `src/messages`
- `CvImportModel` from `src/models/cv-import-model.ts`
- `createCVModel` from `src/models/cv-model.ts`
- `PortfolioChatModel` from `src/models/portfolio-chat-model.ts`
- `PortfolioEditModel` from `src/models/portfolio-edit-model.ts`
- `formatAllCV` and `formatters` from `src/services/formatter`
- `MessageProcessor` from `src/services/processor`

## Models

| File                                      | Use                                      |
| ----------------------------------------- | ---------------------------------------- |
| `src/models/portfolio-chat-model.ts`      | Visitor answers over published knowledge |
| `src/models/portfolio-edit-model.ts`      | Owner draft proposals                    |
| `src/models/portfolio-edit-model.test.ts` | Colocated edit-model test                |
| `src/models/cv-import-model.ts`           | Reviewed extraction                      |
| `src/models/cv-model.ts`                  | CV text prepared for a model             |
| `src/models/classification-prompt.ts`     | Classification prompt                    |
| `src/models/gpt-prompt.ts`                | GPT prompt                               |
| `src/models/casual-questions.ts`          | Casual question set                      |
| `src/models/question-categories.ts`       | Question categories                      |
| `src/models/referral-modal.ts`            | Referral prompt content                  |
| `src/types/cv.ts`                         | CV types for the assistant               |

## Services

| Path                               | Use                          |
| ---------------------------------- | ---------------------------- |
| `src/services/classifier`          | Reply classification         |
| `src/services/formatter`           | CV formatting for a model    |
| `src/services/processor`           | `MessageProcessor`           |
| `src/services/referral`            | Referral flow                |
| `src/services/summarizer`          | Summaries                    |
| `src/services/gpt`                 | Provider wrapper             |
| `src/services/constants/errors.ts` | Provider error constants     |
| `src/messages/index.ts`            | Fixed visitor-facing strings |

## App routes

| Route                                                 | Model                  |
| ----------------------------------------------------- | ---------------------- |
| `apps/my-dev-studio/app/api/portfolio-chat/route.ts`  | Visitor chat           |
| `apps/my-dev-studio/app/api/admin/assistant/route.ts` | Owner editor assistant |
| `apps/my-dev-studio/app/api/admin/cv-import/route.ts` | CV import              |

Limits for those routes are `allowPortfolioChat`, `allowStudioAssistant`, and `allowCvImport` in `@shared/cache`.

## Checks

```sh
pnpm --filter @shared/assistant typecheck
pnpm exec vitest run --project unit packages/assistant
```
