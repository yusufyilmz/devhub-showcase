# Assistant package map

Package `@shared/assistant` in `packages/assistant`.

Each product area is a folder under `src`. Screens live in `components/`, provider workflows in `services/`, and validators in `schemas/`. There is no `models/`, `server/`, `client/`, or `types/` folder.

## Root exports from `src/index.ts`

- Message helpers from `src/chat/services/messages.ts`
- `CvImportModel` from `src/cv/services/cv-import-model.ts`
- `createCVModel` from `src/cv/services/cv-model.ts`
- `PortfolioChatModel` from `src/chat/services/portfolio-chat-model.ts`
- `PortfolioEditModel` from `src/studio/services/portfolio-edit-model.ts`
- `formatAllCV` and `formatters` from `src/cv/services/formatter`
- Job workflows from `src/jobs/services/job-assistant.ts`
- `MessageProcessor` from `src/chat/services/processor`

## Chat

| Path                                          | Use                                      |
| --------------------------------------------- | ---------------------------------------- |
| `src/chat/components`                         | Chat screens and controls                |
| `src/chat/services/portfolio-chat-model.ts`   | Visitor answers over published knowledge |
| `src/chat/services/main-portfolio-chat.ts`    | Main portfolio chat workflow             |
| `src/chat/services/premium-portfolio-chat.ts` | Pro portfolio chat workflow              |
| `src/chat/services/portfolio-stream.ts`       | Browser answer stream                    |
| `src/chat/services/provider.ts`               | OpenAI provider wrapper                  |
| `src/chat/services/classifier`                | Reply classification                     |
| `src/chat/services/processor`                 | `MessageProcessor`                       |
| `src/chat/services/referral`                  | Referral flow                            |
| `src/chat/services/summarizer`                | Summaries                                |
| `src/chat/services/gpt`                       | GPT wrapper                              |
| `src/chat/services/messages.ts`               | Fixed visitor-facing strings             |

## CV

| Path                                 | Use                                 |
| ------------------------------------ | ----------------------------------- |
| `src/cv/components`                  | PDF data, definition, and rendering |
| `src/cv/services/cv-import-model.ts` | Reviewed extraction                 |
| `src/cv/services/cv-model.ts`        | CV text prepared for a model        |
| `src/cv/services/formatter`          | CV formatting for a model           |
| `src/cv/services/cv-response.ts`     | CV download response factory        |
| `src/cv/schemas/cv.ts`               | CV types for the assistant          |

## Studio and portfolio

| Path                                                | Use                          |
| --------------------------------------------------- | ---------------------------- |
| `src/studio/components`                             | Studio editors and workspace |
| `src/studio/services/portfolio-edit-model.ts`       | Owner draft proposals        |
| `src/studio/services/focused-assistant.ts`          | Selected-source writing      |
| `src/studio/services/studio-agent-prompt.ts`        | Studio agent prompt          |
| `src/portfolio/components`                          | Portfolio and editor screens |
| `src/portfolio/services/portfolio-metadata.ts`      | Portfolio page metadata      |
| `src/portfolio/services/portfolio-branding.ts`      | Icon and accent branding     |
| `src/portfolio/services/profile-structured-data.ts` | Profile structured data      |

## Fitness and jobs

| Path                                                | Use                                  |
| --------------------------------------------------- | ------------------------------------ |
| `src/fitness/components`                            | Plan assistant UI                    |
| `src/fitness/services/fitness-assistant.ts`         | Fitness proposals                    |
| `src/fitness/schemas/fitness-assistant-contract.ts` | Fitness request and proposal schemas |
| `src/fitness/services/fitness-context.ts`           | Bounded fitness context              |
| `src/fitness/services/workout-draft.ts`             | Workout draft additions              |
| `src/jobs/services/job-assistant.ts`                | Job match and interview workflows    |

## App routes

| Route                                                 | Workflow               |
| ----------------------------------------------------- | ---------------------- |
| `apps/my-dev-studio/app/api/portfolio-chat/route.ts`  | Visitor chat           |
| `apps/my-dev-studio/app/api/admin/assistant/route.ts` | Owner editor assistant |
| `apps/my-dev-studio/app/api/admin/cv-import/route.ts` | CV import              |

Limits for those routes are `allowPortfolioChat`, `allowStudioAssistant`, and `allowCvImport` in `@shared/lib/cache`.

## Checks

```sh
pnpm --filter @shared/assistant typecheck
pnpm exec vitest run --project unit packages/assistant
```

The feature surface map and shallow exports are maintained in [the assistant catalog](../../../../packages/assistant/CATALOG.md). App source imports are prohibited.
