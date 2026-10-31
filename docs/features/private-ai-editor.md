# Private AI portfolio editor

The AI assistant tab lets a confirmed owner request changes to their current portfolio draft. An active Pro subscription must be assigned to that portfolio, with a remaining studio assistant allowance. The billing page now supports assigning Pro independently of public visitor chat. Temporary managed portfolios are not supported by this owner assistant.

## Review workflow

1. Choose an initial portfolio layout, then open the AI assistant tab in your own editor.
2. Describe a change or provide facts for new career entries. Your current draft, including private content, is sent to OpenAI. Avoid storing secrets in the portfolio or request.
3. Review the proposed fields, reasons and before/after values. Missing facts can produce a clarification with no changes.
4. Select the changes you want and apply them to the draft. Related fields must be selected together when needed to preserve valid relationships.
5. Review the draft in the normal editor. Use Save changes when ready. Saving an already published portfolio updates the public page; the assistant never changes the publication checkbox.

Discard proposal makes no draft changes. Undo AI changes restores the previous draft only while the applied result is still unchanged. The existing editor discard/revision controls remain available. Changing the draft or saved revision invalidates a pending proposal. A proposal generated before a concurrent saved update is rejected by the server.

## Shared contracts and model

The domain contract lives in `@shared/lib/ai-edit`; the reusable PortfolioEditModel lives in packages/chat. Proposals replace allowlisted profile fields rather than arbitrary object paths, code or tools. Supported fields cover introduction, career collections, skills/languages, layout, theme, hero, section configuration and PDF preferences. Contact details, usernames, ownership, billing, CV URLs, onboarding flags and portfolio publication are outside the allowlist.

The model receives the owner's validated current draft and the shared profile schema as quoted data. Static instructions require preserving facts and IDs, asking for missing details, and avoiding moving private project facts into public fields. Instructions are safeguards, not proof of factual accuracy: the owner must review generated prose. Existing project public flags cannot change through a proposal and new projects must be private. No links are fetched and no external tools execute.

The structured response contains at most 12 unique fields with complete JSON field values, a reason per field and a summary. Runtime validation parses JSON values and validates the combined profile, including unique IDs, date relationships, project/experience references and section sequence. Applying a selected subset repeats complete validation without mutating the original. The existing save endpoint validates again. Invalid or incomplete provider output never applies partially.

The provider uses OPENAI_EDITOR_MODEL, default gpt-6-luna, with Responses structured output, store:false, no retries, a 45 second timeout and 12,000 output tokens. Input context is capped at 180,000 characters including the field schema. No history is stored server-side or sent from previous conversations. This is contextual prompting, not model fine-tuning. The assistant currently uses completed proposals rather than token streaming.

## Server boundaries and accounting

GET/POST `/api/admin/assistant` require confirmed ownership through the existing session workspace. POST also validates same origin, a bounded request body, current profile ID and saved revision. It rereads ownership/revision after generation. The service billing client is used only for atomic usage reservation, never as a replacement for owner authorization.

Paid calls reserve a studio_assistant attempt before invoking the model. Missing configuration, expired grants, foreign assignments, exhausted quotas and failed reservations deny access. Private portfolios are supported; public chat opt-in is not required. Separate Redis limits permit ten owner attempts per hour and one hundred globally per day, independent of the billing period allowance. Failed, aborted and uncertain attempts count, as established by billing. Oversized context is rejected before reserving usage. There are no automatic provider retries or refunds.

Responses are private/no-store. Prompts, private drafts, provider responses and upstream errors are not logged by this path. Errors preserve the local draft. The route never calls save, publishes, transfers ownership or edits a billing grant. User actions in the existing Save changes workflow are required to persist anything.

## Configuration and verification

No new migration is required. Use the existing OpenAI, Redis, Supabase service key and premium billing configuration; OPENAI_EDITOR_MODEL is optional. Pro assignment may be set in /admin/billing without enabling public chat. The Stripe sandbox's actual checkout and a paid OpenAI proposal must still be verified independently.

Tests cover allowlisted/combined validation, private project visibility, unsupported fields, selected changes, owner authorization, stale revisions, quotas, structured provider requests and explicit UI apply. Network/provider tests use mocks and fictional identities. No paid provider call or production record mutation is performed by tests. Browser verification requires a working Playwright Chromium installation.
