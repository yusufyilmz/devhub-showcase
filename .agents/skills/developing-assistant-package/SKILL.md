---
name: developing-assistant-package
description: Change portfolio chat, owner edit proposals, and CV import models
  in @shared/assistant. Use when editing an assistant model, prompt, formatter,
  classifier, processor, summarizer, or fixed assistant message in
  packages/assistant.
---

# Developing the assistant package

`packages/assistant` is `@shared/assistant`. It owns models and reusable chat/assistant backend workflows. Workflows validate permitted context, enforce publication and quota checks, and call providers. App routes verify request identity and origin and supply validated configuration; proposals never write profiles automatically.

Read [the file map](references/map.md) and [packages/assistant/CATALOG.md](../../../packages/assistant/CATALOG.md). Read `docs/features/portfolio-ai-foundation.md` before changing what a visitor or an owner can ask. Read [mydevstudio-business](../mydevstudio-business/SKILL.md) for publication boundaries.

## Models

| Symbol                                       | Job                                           | Must not                                          |
| -------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| `PortfolioChatModel`                         | Answer a visitor from published knowledge     | Read owner-only notes or another profile          |
| `PortfolioEditModel`                         | Propose an owner draft                        | Persist the proposal or skip `ai-edit` validation |
| `CvImportModel`                              | Extract fields from an uploaded CV for review | Write the profile or store the file in a log      |
| `createCVModel`, `formatAllCV`, `formatters` | Prepare CV text for a model                   | Decide download permission                        |

`MessageProcessor` classifies a chat reply. Fixed strings live in `src/messages`: greeting, failure, goodbye, out of topic, referral, and the related helpers. Change a fixed string there instead of duplicating it in the app.

Public chat context comes from `@shared/lib/profiles`. The public projection and the owner projection are different. Do not put private owner knowledge into the visitor model. The app reads the published snapshot for a public request. Do not cache another user's document into the prompt.

## Route responsibilities

Keep these in the app even if the model file is the file you are editing:

| Concern                                | Owner                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Confirmed owner for edit and CV import | `features/admin` and `@shared/auth`                                                            |
| Visitor chat access                    | `@shared/assistant/chat` and `@shared/assistant/premium-chat`; app adapters bind configuration |
| Attempt limits                         | `@shared/lib/cache` `allowPortfolioChat`, `allowStudioAssistant`, `allowCvImport`              |
| Proposal schema                        | `@shared/lib/profiles`                                                                         |
| CV file size and type                  | `@shared/lib/cv-file`                                                                          |
| Reviewed CV fields                     | `@shared/lib/cv-import`                                                                        |
| Saving                                 | `ProfileService` in the app's save route                                                       |

A missing provider key, a limit refusal, or a provider error becomes the supported unavailable response in the route. Do not invent a successful profile update. Do not retry by writing a stale revision.

## Prompts and logs

Prompts live under `src/models`, including `classification-prompt.ts`, `gpt-prompt.ts`, `casual-questions.ts`, and `question-categories.ts`. Services under `src/services` cover classifier, formatter, processor, referral, summarizer, and the GPT wrapper.

Do not log prompts, CV text, tokens, raw provider bodies, or profile documents. Tests use a fictional profile and a stubbed provider. `src/models/portfolio-edit-model.test.ts` is the colocated pattern. Do not call a paid provider from the unit suite.

Do not widen tool access inside a prompt. The model proposes text. The schema decides what can be saved.

## Exports

| Export                         | Path             |
| ------------------------------ | ---------------- |
| `@shared/assistant`            | `src/index.ts`   |
| `@shared/assistant/models/*`   | `src/models/*`   |
| `@shared/assistant/services/*` | `src/services/*` |

Add a public model to `src/index.ts` when app code should import it from the package root. Add a catalog row. Wildcard exports already cover a single model or service file. Run `pnpm check:exports` after changing `package.json`.

Dependencies are `@shared/config`, `@shared/lib`, `compromise`, `openai`, and `pino`. New external packages use `catalog:`. Do not import the Next.js app.

## Verification

```sh
pnpm --filter @shared/assistant typecheck
pnpm exec vitest run --project unit packages/assistant
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/assistant/route.test.ts
pnpm exec vitest run --project unit apps/my-dev-studio/app/api/admin/cv-import/route.test.ts
```

Run the route test that matches the model you changed. Visitor chat behavior is also covered by colocated `app/api/chat/stream` and `app/[username]/chat` tests and `e2e/portfolio` when the public contract changes.

## Related skills

- [Shared backend development](../mydevstudio-development/SKILL.md)
- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)

Backend entry points: `@shared/assistant/chat`, `@shared/assistant/premium-chat`, `@shared/assistant/fitness-context`, and `@shared/assistant/workout-draft`. Implementations/tests live under `src/services`. Shared workflows receive configuration callbacks; never import app env modules.

## Shared feature surfaces

This package also owns chat/companion UI, Fitness proposal UI, portfolio and studio workspaces, sections, examples, management UI and CV rendering. Read [the catalog](../../../packages/assistant/CATALOG.md) for current exact entry points. `@shared/assistant/chat` is the server workflow; use `@shared/assistant/chat-ui` for UI. CV modules are under `src/components/cv`, imported as `@shared/assistant/cv`; the removed templates package must not be restored.

App studio/home/reviews/portfolio/platform/chat feature folders are removed. Session, cookie, environment and transport adapters are colocated with the owning pages/routes under `app`. Do not add forwarding modules or import app sources into shared components. Fitness components take authenticated request and notification callbacks; visitor UI takes the premium server action. Keep primitive controls and styles in `@shared/ui`.
