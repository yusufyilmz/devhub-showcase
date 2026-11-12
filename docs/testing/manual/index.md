# Manual feature testing

Local tooling: [Local development setup and test login](local-development.md).

Shared feature ownership: [Assistant, chat, companion and portfolio migration](assistant-package.md).

Route structure: [App route colocation](route-colocation.md).

Workspace catalogs: [Generic catalog generation](catalog-generation.md).

Workspace tooling: [Shared CLI and test packages](shared-tooling.md) and [Repository lookup](repository-lookup.md).

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

Fitness OS: [Reusable notifications, background reminders and PWA](notifications.md).

Deployment tooling: [App routing, Fitness cutover and free Actions](deployments.md).

## Feature guides

| Feature                                                            | Scope/status                                                                                                  | Manual steps                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Homepage registry, composer, feature cards and section browser     | Implemented                                                                                                   | [Open guide](home.md)                   |
| Server-rendered fictional portfolios and images                    | Implemented; includes carousel autoplay                                                                       | [Open guide](examples.md)               |
| Curated profession presets — task 12                               | Implemented                                                                                                   | [Open guide](curated-templates.md)      |
| Appearance picker, fonts, tokens and stored preferences            | Implemented                                                                                                   | [Open guide](appearance.md)             |
| Page section rail and hover previews                               | Implemented where the page has navigable sections                                                             | [Open guide](section-navigation.md)     |
| Shared controls, feedback, forms and layout                        | Implemented; local Storybook required                                                                         | [Open guide](shared-ui.md)              |
| Studio editor header, section hierarchy and footer                 | Implemented; verify at desktop and phone widths                                                               | [Open guide](editor-presentation.md)    |
| Featured engineer portfolio                                        | Implemented for the main public portfolio                                                                     | [Open guide](featured-portfolio.md)     |
| Assistant companions                                               | Animated launchers, chat input companions, request reactions, guest guidance and notices                      | [Open guide](agent-companion.md)        |
| Portfolio referral reviews                                         | Owner-only moderation under the original portfolio username                                                   | [Guide](portfolio-reviews.md)           |
| Companion feature guides                                           | Timed contextual tips, feature catalogs, and private completion progress                                      | [Guide](companion-feature-guide.md)     |
| Full-page compositions and Storybook previews                      | Implemented for MyDevStudio screen families                                                                   | [Open guide](page-compositions.md)      |
| Sign-in screen, owner workspace and access boundaries              | Implemented; live OAuth needs provider configuration                                                          | [Open guide](authentication.md)         |
| Guided portfolio onboarding, restart and Studio AI help            | Implemented                                                                                                   | [Open guide](onboarding.md)             |
| Completion checklist — task 06                                     | Implemented                                                                                                   | [Open guide](completion.md)             |
| Draft undo/redo and reorder focus — task 09                        | Implemented                                                                                                   | [Open guide](undo-redo.md)              |
| Browser recovery, failed save and conflicts — task 08              | Implemented for the main editor                                                                               | [Open guide](draft-recovery.md)         |
| Inline portfolio editor and collapsible sidebar with icons         | Implemented locally; deployed verification pending                                                            | [Open guide](editor-workspace.md)       |
| Private responsive preview — task 11                               | Implemented                                                                                                   | [Open guide](responsive-preview.md)     |
| Drag-and-drop portfolio layout                                     | Owner-only arrangement in the responsive draft preview                                                        | [Open guide](visual-portfolio-order.md) |
| Built-in sections, item selection and order                        | Implemented                                                                                                   | [Open guide](built-in-sections.md)      |
| Custom section catalog and rich compositions                       | Implemented                                                                                                   | [Open guide](custom-sections.md)        |
| Storybook section and Studio previews                              | Implemented with fictional fixtures                                                                           | [Open guide](storybook-previews.md)     |
| Shared homepage and portfolio blocks and Sections settings         | Implemented with local fixture and testimonial spacing checks                                                 | [Open guide](portfolio-blocks.md)       |
| Private section templates and reviewed JSON import/export          | Implemented; template storage must be migrated                                                                | [Open guide](section-templates.md)      |
| Independent website and CV languages                               | Implemented; authored text is not automatically translated                                                    | [Open guide](language.md)               |
| PDF settings and ATS layouts — task 27                             | Implemented; ATS compatibility is not guaranteed                                                              | [Open guide](cv-layouts.md)             |
| Hero media, YouTube and curated social cards — task 30             | Implemented; remote providers can be blocked                                                                  | [Open guide](media.md)                  |
| Consent and reviewed CV import                                     | Optional configured integration                                                                               | [Open guide](cv-import.md)              |
| Optional Google profile import                                     | Optional configured integration                                                                               | [Open guide](google-import.md)          |
| Saved private and published public AI knowledge                    | Implemented; inspection makes no model call                                                                   | [Open guide](ai-knowledge.md)           |
| AI change review, apply and undo — task 17                         | Optional configured integration                                                                               | [Open guide](ai-review.md)              |
| Focused writing alternatives — task 18                             | Optional configured integration                                                                               | [Open guide](ai-writing.md)             |
| Portfolio feedback — task 20                                       | Optional configured integration                                                                               | [Open guide](ai-feedback.md)            |
| Centered Studio and portfolio chat, provider failure and streaming | Implemented UI; provider access is optional                                                                   | [Open guide](studio-chat.md)            |
| Fitness assistant, workouts and shopping                           | Optional provider and Redis setup                                                                             | [Open guide](fitness-assistants.md)     |
| Assistant token budgeting and saved prompt composition             | Implemented; hosted verification pending                                                                      | [Open guide](assistant-token-budget.md) |
| Full-page visitor chat, access and published sources — task 21     | Optional configured integration                                                                               | [Open guide](visitor-chat.md)           |
| Sandbox billing, assignment, quota and readiness screens           | Sandbox integration; includes desktop and mobile appearance checks                                            | [Open guide](billing.md)                |
| Managed temporary portfolios and transfer                          | Implemented with desktop and mobile layout checks; administrator setup required                               | [Open guide](managed-portfolios.md)     |
| Private CV versions — task 25                                      | Implemented; private-CV-library migration required                                                            | [Open guide](cv-versions.md)            |
| Reviewed job-specific CV drafts — task 26                          | Implemented; local keyword matching, no provider call                                                         | [Open guide](job-cv.md)                 |
| Private saved revision history — task 10                           | Implemented; history migration required; includes heading hierarchy check                                     | [Open guide](revision-history.md)       |
| Independent website/CV fields — task 28                            | Implemented; publication migration required for public payload checks                                         | [Open guide](output-fields.md)          |
| Testimonial moderation in the profile editor                       | Original portfolio owner only; testimonial migration required                                                 | [Open guide](testimonial-reviews.md)    |
| Separate draft save, review, publish and withdraw — task 07        | Implemented; publication snapshot migration required                                                          | [Open guide](publication.md)            |
| Retained username redirects — task 14                              | Implemented in PR #87                                                                                         | [Open guide](username-redirects.md)     |
| Public/unlisted discovery — partial task 15                        | Public/unlisted implemented in PR #87; protected flow locally verified, separate migration pending            | [Open guide](unlisted.md)               |
| Published branding, metadata and private/missing responses         | Implemented                                                                                                   | [Open guide](seo.md)                    |
| Fresh Next.js build and CI regression — task 04 support            | Build fix shipped in PR #84; production verification is separate                                              | [Open guide](ci-build.md)               |
| Reviewed scheduled snapshots — task 16                             | Implemented checkpoint; migration, worker credentials and recurring scheduler required; production unverified | [Open guide](scheduled-publication.md)  |

## Password access

[Password access guide](password-access.md) covers owner review, password entry, signed visitor access, protected pages/CVs/generated images and revocation. Local database/API/unit and desktop/mobile flow checks passed. The separate password migration and hosted verification remain pending in PR #87.

## Work that must not be marked implemented

Password protection is not yet deployed; its separate migration remains pending in [PR #87](https://github.com/yusufyilmz/devhub-showcase/pull/87). Unlisted content is accessible by link. Publication migrations and the native minute-level scheduler are now verified live, including successful cron runs; this does not prove a deployed user-created scheduled publication or password flow.

Other roadmap work without an implemented feature is not covered by a pretend test flow. Add a real guide and index entry as each feature is implemented. See [publishing-policy progress](../publishing-policies.md) for the current group boundary.

## Adding or changing a feature

Create/update its guide in this directory and add/update the index row in the same PR. Use [the guide template](template.md). Include happy path, save/reload persistence, failure/retry/conflict and permission/public-private checks when applicable. Explain unavailable external setup and leave unexecuted results Not run. Link the guide from the PR's per-feature test section.

## Fitness login compatibility

[Fitness login and saved workspace compatibility](fitness-login.md): stored exercise/workout compatibility implemented; Google provider configuration and deployed acceptance remain pending.

[My Fitness Studio workspaces and shared UI](fitness-workspaces.md) covers account isolation, the public demo, branding, and dashboard styling.

[Fitness task plans](fitness-task-plans.md) covers the shared accent-gradient plan card, header actions, pagination, task drill-down, and desktop and mobile checks for Tasks.

[Fitness shared controls and notifications](fitness-shared-ui.md) covers the task editor, weekly tabs, calendar, agenda button states, and reminder permission checks.

Environment configuration: [Application environment modules](environment-modules.md).
