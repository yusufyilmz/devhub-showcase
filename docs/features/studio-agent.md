# Studio Agent

The private portfolio model is `PortfolioEditModel` in `@shared/assistant`.
Its version-controlled instructions live in
`packages/assistant/src/models/studio-agent-prompt.ts` and are imported directly
into the provider request. Changing this module changes the live editor prompt;
there is no separate dashboard prompt to synchronize or model to train.

The existing `/api/admin/assistant` endpoint connects it to the AI editor. It
checks the authenticated owner, origin, profile ID, revision, Pro entitlement,
quota and rate limit before calling the model. It validates the returned proposal
and rechecks ownership and revision afterward. Review and apply update the local
draft; Save uses the existing revision-aware persistence path. Publish remains a
separate owner action. Neither the prompt nor the model can execute writes.

Portfolio and CV share career facts but retain independent display settings.
CV file extraction continues through the separately validated `CvImportModel`
and its existing review screen. Visitor chat never receives owner context.

## Setup

Configure server-only `OPENAI_API_KEY`, `OPENAI_EDITOR_MODEL`, `REDIS_URL`,
`REDIS_TOKEN`, and the existing Supabase and sandbox billing configuration in
`.env.example`. The owner needs the existing Pro entitlement assigned to the
current portfolio. Never put provider keys in browser configuration.

The current provider is the OpenAI Responses API with strict structured output,
`store: false`, bounded input/output, no tools, and no automatic retries. The
existing default model ID has not been verified for this account. Set
`OPENAI_EDITOR_MODEL` to a model available to the deployment's API project and
test structured output compatibility before enabling the feature. A provider
failure returns the existing unavailable response and does not alter the draft.
There is no automatic cross-provider fallback or silent paid retry.

Official API guidance: <https://developers.openai.com/api/docs/guides/tools>.
Account model access must be checked with that project's Models API; documentation
alone cannot establish account access. No real portfolio should be used for a
provider smoke test.

## Development

Use fictional profiles and a stubbed provider. Run the assistant model tests and
the admin assistant route tests, followed by `pnpm check` and `pnpm test`.
The model test checks that the actual provider request uses the saved prompt,
requires strict output, disables storage, rejects incomplete responses, and
rejects publication fields. Route tests cover the authorization boundary.

Fitness integration is separate work: its bearer-token identity and workspace
membership must be enforced by the Fitness app. Never supply fitness records to
the Studio Agent or use a prompt as authorization. No fitness endpoint or write
permission is introduced by this change.
