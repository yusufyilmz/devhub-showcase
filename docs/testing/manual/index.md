# Manual feature testing

This is the central manual acceptance-test catalog for work implemented in this project/chat. Each feature has its own guide with prerequisites, numbered steps, clickable URLs, route paths, expected results and a place to record actual evidence. Related older guides remain useful for deeper scenarios.

## Before you start

- Use the PR preview that contains the feature and a disposable confirmed account with fictional content. Production-shaped links below are navigation examples, not evidence of deployment or instructions to edit a real portfolio. Replace their hostname with the matching preview; keep the route path.
- Create a second owner account and a signed-out browser for access checks. Managed flows additionally need an authorized test manager and eligible confirmed recipient. Never use production records to exercise conflicts, withdrawal, transfer or deletion.
- Apply required migrations only through the normal reviewed process in a disposable environment. Publication/history/private-CV/alias/unlisted features need their corresponding migrations. Prepared migrations have not been applied to production by this work. Consult each linked guide before testing.
- Optional live OpenAI/Redis/OAuth/Stripe checks need their documented test configuration. AI requests can consume allowance; payments must use Stripe test mode. Local Playwright fixtures simulate these providers and do not prove real-provider behavior.
- Test desktop and phone widths, keyboard focus, light/dark, selected fonts/accents, long/empty/error states and reduced motion where relevant. Use the same feature route for editor tabs; do not invent URLs for tabs.
- **Save changes / Save draft is private saving.** Review publication and Confirm publication are separate. Template-library and CV-version saves are also separate from canonical profile saving. Older deployed versions may differ; test the matching commit.
- For every run record environment URL, commit/PR, tester, date, account role, prerequisites, actual outcome and screenshot/trace or safe error evidence. Start as **Not run**, then use **Pass**, **Fail** or **Blocked** with a reason. Do not record credentials, tokens or real private portfolio content.
- All new guide rows start **Not run**. Previously passing automated tests or GitHub CI do not turn these manual checklists into completed manual runs. Live deployment/provider verification stays separate.

For local fixture setup and commands, see [testing and verification](../../testing.md). Local Storybook starts with `pnpm --filter storybook-app storybook` at [localhost:6006](http://localhost:6006/), path `/`.

## Feature guides

| Feature                                                        | Scope/status                                                                      | Manual steps                        |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| Homepage, composer and section browser                         | Implemented                                                                       | [Open guide](home.md)               |
| Server-rendered fictional portfolios and images                | Implemented                                                                       | [Open guide](examples.md)           |
| Curated profession presets — task 12                           | Implemented                                                                       | [Open guide](curated-templates.md)  |
| Appearance picker, fonts, tokens and stored preferences        | Implemented                                                                       | [Open guide](appearance.md)         |
| Page section rail and hover previews                           | Implemented where the page has navigable sections                                 | [Open guide](section-navigation.md) |
| Shared controls, Card types and section primitives             | Implemented; local Storybook required                                             | [Open guide](shared-ui.md)          |
| Sign-in, owner workspace and access boundaries                 | Implemented; live OAuth needs provider configuration                              | [Open guide](authentication.md)     |
| Guided onboarding — task 05                                    | Implemented                                                                       | [Open guide](onboarding.md)         |
| Completion checklist — task 06                                 | Implemented                                                                       | [Open guide](completion.md)         |
| Draft undo/redo and reorder focus — task 09                    | Implemented                                                                       | [Open guide](undo-redo.md)          |
| Browser recovery, failed save and conflicts — task 08          | Implemented for the main editor                                                   | [Open guide](draft-recovery.md)     |
| Private responsive preview — task 11                           | Implemented                                                                       | [Open guide](responsive-preview.md) |
| Built-in sections, item selection and order                    | Implemented                                                                       | [Open guide](built-in-sections.md)  |
| Custom section catalog and rich compositions                   | Implemented                                                                       | [Open guide](custom-sections.md)    |
| Private section templates and reviewed JSON import/export      | Implemented; template storage must be migrated                                    | [Open guide](section-templates.md)  |
| Independent website and CV languages                           | Implemented; authored text is not automatically translated                        | [Open guide](language.md)           |
| PDF settings and ATS layouts — task 27                         | Implemented; ATS compatibility is not guaranteed                                  | [Open guide](cv-layouts.md)         |
| Hero media, YouTube and curated social cards — task 30         | Implemented; remote providers can be blocked                                      | [Open guide](media.md)              |
| Consent and reviewed CV import                                 | Optional configured integration                                                   | [Open guide](cv-import.md)          |
| Optional Google profile import                                 | Optional configured integration                                                   | [Open guide](google-import.md)      |
| Saved private and published public AI knowledge                | Implemented; inspection makes no model call                                       | [Open guide](ai-knowledge.md)       |
| AI change review, apply and undo — task 17                     | Optional configured integration                                                   | [Open guide](ai-review.md)          |
| Focused writing alternatives — task 18                         | Optional configured integration                                                   | [Open guide](ai-writing.md)         |
| Portfolio feedback — task 20                                   | Optional configured integration                                                   | [Open guide](ai-feedback.md)        |
| Fullscreen Studio chat and provider failure/streaming behavior | Implemented UI; provider access is optional                                       | [Open guide](studio-chat.md)        |
| Visitor chat isolation, streaming and source links — task 21   | Optional configured integration                                                   | [Open guide](visitor-chat.md)       |
| Sandbox billing, assignment, quota and readiness screens       | Sandbox integration; billing-reliability roadmap remains separate                 | [Open guide](billing.md)            |
| Managed temporary portfolios and transfer                      | Implemented; administrator setup required                                         | [Open guide](managed-portfolios.md) |
| Private CV versions — task 25                                  | Implemented; private-CV-library migration required                                | [Open guide](cv-versions.md)        |
| Reviewed job-specific CV drafts — task 26                      | Implemented; local keyword matching, no provider call                             | [Open guide](job-cv.md)             |
| Private saved revision history — task 10                       | Implemented; history migration required                                           | [Open guide](revision-history.md)   |
| Independent website/CV fields — task 28                        | Implemented; publication migration required for public payload checks             | [Open guide](output-fields.md)      |
| Separate draft save, review, publish and withdraw — task 07    | Implemented; publication snapshot migration required                              | [Open guide](publication.md)        |
| Retained username redirects — task 14                          | Implemented checkpoint in draft PR #86                                            | [Open guide](username-redirects.md) |
| Public/unlisted discovery — partial task 15                    | Implemented checkpoint in draft PR #86; password protection remains unimplemented | [Open guide](unlisted.md)           |
| Published branding, metadata and private/missing responses     | Implemented                                                                       | [Open guide](seo.md)                |
| Fresh Next.js build and CI regression — task 04 support        | Build fix shipped in PR #84; production verification is separate                  | [Open guide](ci-build.md)           |

## Work that must not be marked implemented

Password-protected portfolio access and scheduled publishing are still unfinished in [draft PR #86](https://github.com/yusufyilmz/devhub-showcase/pull/86). Public/unlisted discovery is only part of task 15; unlisted content is accessible by link. Do not claim password protection, scheduling execution, cron/retry behavior or live production migration verification from these guides.

Other roadmap work without an implemented feature is not covered by a pretend test flow. Add a real guide and index entry as each feature is implemented. See [publishing-policy progress](../publishing-policies.md) for the current group boundary.

## Adding or changing a feature

Create/update its guide in this directory and add/update the index row in the same PR. Use [the guide template](template.md). Include happy path, save/reload persistence, failure/retry/conflict and permission/public-private checks when applicable. Explain unavailable external setup and leave unexecuted results Not run. Link the guide from the PR's per-feature test section.
