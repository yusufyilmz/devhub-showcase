# Portfolio AI foundation

This is step one of the premium AI roadmap. It prepares reusable per-portfolio context and request boundaries. It does not introduce subscriptions, payments, an editing agent or a new public chat entitlement. The existing main portfolio chat remains available; other portfolios are not enabled before billing and owner controls are implemented.

## Knowledge contract

packages/lib/portfolio-knowledge exposes schema version 1 projections with distinct public and owner audiences. Both identify the source portfolio, username, saved revision and update timestamp. Knowledge is derived deterministically from the current saved document, not written by an LLM. Successful saves, including saved CV imports, are therefore reflected in the next read without a background job, duplicate database record or paid summarization request. Draft edits remain drafts.

Public knowledge requires a published snapshot. It contains identity/contact information already published by the portfolio and the currently visible and selected career sections. Private projects, hidden standard/custom sections, unselected built-in items, account metadata and editing settings are excluded. Visible custom sections resolve their own source selections independently, using the same source adapter as public rendering. A visible custom source can expose an item omitted from the built-in view, as it already does on the portfolio. Image pixels, remote linked pages and external referral/review records are not ingested. Public text manually authored by the owner remains public text; the projection cannot infer whether a sentence ought to have been private.

Owner knowledge contains a detached copy of the full saved profile, including private projects and layout/settings, for the later studio assistant. It is not a public prompt. Builders are pure adapters, not authorization mechanisms: callers must first read through the existing public or owner/manager repository boundary. The provider serializer whitelists the public contract again, stripping unrelated internal properties and rejecting owner-audience context.

The editor's AI profile tab reads the existing authorized profile endpoint. It uses the current managed profile read URL when editing a managed record. It lets an authorized editor inspect saved public/owner knowledge and reload after saving. A private portfolio has no public knowledge. Opening this inspector does not enable chat or call OpenAI.

## Reusable chat service

PortfolioChatModel in packages/chat accepts only public knowledge and a bounded visitor question. It uses the Responses API with OPENAI_CHAT_MODEL (default gpt-6-luna), reasoning disabled, store:false, no tools, no automatic retries, an 800 output token limit and a 45 second timeout. Instructions separate source facts and untrusted content, forbid invented facts and editing, and ask the assistant to acknowledge missing information. Answers remain probabilistic and must be evaluated; these safeguards are not a guarantee that every answer is correct. Provider retention policies still apply to store:false requests.

The compatibility CV adapter now requires an explicit profile and no longer injects default achievements, personality strengths, testing tools or other unstated technologies. Its projects exclude private entries. The classifier/processor no longer default to a bundled person's model, and the legacy presenter prompt is person-independent. The existing main referral workflow is retained separately from the new public answer path. General premium launch, streaming, richer citations, multilingual UI and the owner editing assistant belong to later steps.

## Request boundary

The existing main chat action is bound to its portfolio username. Each request resolves that username from public storage again. Missing, unpublished or renamed portfolios never fall back to a seed or another person's data. The server constructs the context; browsers cannot supply their own trusted profile/model. Until paid entitlements are available, the adapter explicitly permits only the existing main portfolio.

Questions are bounded to 2,000 characters and the serialized context to 180,000 characters. Redis uses atomic expiring counters: 10 messages per visitor session/minute, 100 per portfolio/hour and 500 globally per 24-hour window. Portfolio/global limits prevent rotating client session IDs from creating unlimited provider calls. These are temporary operational limits; subscription allowances and stronger visitor abuse controls are later steps. Configuration or limiter errors fail closed. Raw visitor questions, generated answers and upstream errors are not logged by this chat path. The username page has a 60 second function budget, compatible with the current Vercel deployment limit.

## Browser state

The widget has a provider/store instance per portfolio and saved revision. Session storage keys include schema namespace, portfolio ID and revision. Histories stay separate by conversation type and retain at most 20 messages each. They do not use persistent local storage or import the old global history. Navigation to a different portfolio or revision creates fresh state. Clearing/closing the browser session removes this app-managed session history under normal browser session behavior; restored browser sessions can retain session storage. Already downloaded public information cannot be revoked remotely. History is not submitted as a source of profile facts in this foundation.

## Verification and next steps

Tests cover public visibility/source selection, private context isolation, changed revisions, unknown-property stripping, unsupported context rejection, request limits, no seed fallback, scoped browser state and authorized editor inspection. Browser tests explicitly disable provider credentials and use local fictional account fixtures. No paid model call is made by tests.

Next: account/portfolio entitlements and usage accounting, Stripe test-mode billing, the premium visitor widget across layouts, and then a private AI editor with validated proposed changes and explicit apply/save/publication controls. Prisma remains disabled; this step requires no schema migration.
