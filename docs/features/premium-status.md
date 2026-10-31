# Premium account status

The subscription page now explains the account's current access rather than displaying only a chat counter. It shows active, Free, scheduled, expired, past due, canceled and inactive access; its period end date; assignment/publication; and separate private assistant and visitor chat usage with remaining attempts. Remaining counters clamp at zero. Removing an assignment still disables both premium assistants without resetting usage.

## Sources and authority

BillingRepository continues to read the confirmed account through its session client and RLS. entitlementSummary preserves the existing start-inclusive, end-exclusive access rule and adds an access explanation and period start. The private billing GET includes a coarse aiConfigured boolean. This checks configuration presence only; it does not verify credentials, call OpenAI/Redis/Stripe, test webhook delivery or report individual environment variable names/values.

The shared billing summary validator and premiumFeatureStatus provide display guidance for assignment, configuration, exhausted allowances, private portfolios and chat opt-in. Private editing does not require publication or visitor chat. The main portfolio's visitor chat retains its legacy behavior. The actual server authorization and atomic reservation remain authoritative for every paid operation. A readiness label does not reserve capacity or guarantee provider availability.

Refresh status reads the current profile and billing summary with no-store. It aborts an obsolete refresh and removes stale controls if a refresh fails. Status checks do not save, publish, change an assignment, create a Stripe customer/session or consume an AI attempt. Assignment and visitor opt-in remain explicit separate actions. The checkout return notice does not infer payment success from a query parameter; access still comes from confirmed entitlements and the signed webhook workflow.

## Safe billing errors

Checkout and portal responses use allowlisted codes for missing configuration, a busy account lease, an existing subscription, an absent Stripe customer, an expired session or unavailable storage/provider. The UI maps these codes to fixed messages and never displays raw upstream payloads. Unknown errors use a generic retry message. Redirects still require HTTPS on the exact Stripe checkout/portal hosts and now reject URL credentials or nondefault ports.

A temporary demo grant is not a Stripe subscription. Its owner can use its assigned AI allowance while the portal is unavailable until sandbox checkout creates a billing customer. Refreshing never converts a demo grant into a paid subscription. This step does not change subscription prices, webhook events, entitlements, quotas, database schema or the test-only payment boundary.

## Verification

Tests cover access period boundaries, inactive states, feature readiness, refresh/recovery, hidden raw errors, missing portal customers and safe redirects. Browser cases use fictional authenticated fixtures and intercepted billing responses; they verify separate usage, chat opt-in without publication, and checkout return without Pro activation. They do not prove actual Stripe transactions, Google OAuth, live provider responses or production configuration. See [sandbox billing](stripe-billing.md) and [the demo checklist](pricing-and-demo.md) for those operational checks.
