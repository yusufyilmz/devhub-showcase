# Account support — task 32

The staff dashboard is `/admin/support`, with GET/POST `/api/support`. Both use the existing server-controlled `private.portfolio_admins` membership through `requirePortfolioAdmin`, not the main-portfolio ownership helper, editable user metadata or a service-role key. Database RPCs independently verify current membership and confirmed account status. Revocation is checked on each call.

## Setup and permissions

Review and apply `supabase/migrations/20261104183000_account_support.sql` through the normal approved migration process after the existing managed membership, publication snapshot, premium chat and Stripe subscription migrations. This PR does not apply it or add administrators. Review the existing membership roster before enabling support: members can inspect studio account metadata across owners. Accounts with a studio profile or billing record are included, so support can inspect billing after a profile is gone. Accounts that only exist in the separate fitness application are excluded.

The new private audit table has RLS and no direct grants to anonymous, authenticated or service roles. Small explicit SECURITY DEFINER functions use an empty search path and restricted execute permissions, following [Supabase function security guidance](https://supabase.com/docs/guides/database/functions#security-definer-vs-invoker). No client can read the underlying auth table or private documents through these functions.

## Investigation

List at most 25 accounts per page using an opaque UUID cursor, or inspect an exact studio account UUID supplied for the support case. The response includes confirmation/creation status, profile IDs/revisions, separate website/CV publication flags, confirmed subscription status, time-aware Pro access, billing-period allowance and all charged attempt counts, visitor-chat opt-in and the latest 50 support audit records.

It deliberately excludes email, name, canonical/public snapshot documents, private usernames, CVs, uploads, prompts, model answers, raw failures, password hashes, credentials and Stripe customer identifiers. App response schemas fail closed if unexpected fields appear. Responses are private/no-store; the page is dynamic and noindex. The displayed plan and limits are recorded billing metadata, not a grant of current access.

## Permitted change

The only support mutation is **Disable visitor chat**. Staff must select a fixed reason (Customer request, Incident response or Configuration review) and explicitly confirm the account. Free text is not accepted. The SQL transaction changes only `billing_assignments.chat_enabled` and inserts the actor/time/reason/before/after/request ID audit record atomically. If the audit insert fails, the opt-in change rolls back.

A client UUID identifies one logical request. A transaction advisory lock serializes replay, and the audit primary key deduplicates it. Replay must match the original actor, target and reason; mismatches fail closed. A lost response can be retried using the same UUID. Replaying a completed request does not disable a later owner opt-in again. Refresh the audit before starting a distinct support action.

This action does not cancel subscriptions, grant Pro, refund/reset allowance, expose/edit profiles, publish, transfer ownership, permanently ban an account or interrupt an already reserved AI attempt. Owners retain their existing opt-in controls. Missing assignments are recorded as an audited no-op; no assignment or entitlement is created.

## Verification and next dependency

The database suite executes the migration locally with ordinary, anonymous, administrator, revoked and unconfirmed roles. It verifies metadata privacy, quota preservation, audit fields, duplicate/mismatched requests and rollback when audit persistence fails. API and component suites cover authorization/origin checks, input injection, bounded listing, schema privacy, explicit confirmation and retry identity. Browser fixtures cover the staff workflow on desktop/mobile, not production Supabase.

Task 34's failed-operation registry and controlled retry workflow is the next dependent group. It is not implemented or claimed complete by this dashboard. No retry-all, publish or payment action is offered here.

No new deployment secrets are required. Hosted migration/RLS verification and staff-account acceptance remain Not run. Audit metadata is private operational data; include it in the later account-data retention/export/deletion work rather than exporting it publicly.
