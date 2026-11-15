# Stripe sandbox billing

This integration is deliberately test-only: sk_live keys and live webhook events are rejected. Devhub CV is the selected Stripe business account, but its connector exposes live mode only. No Stripe products, prices, webhook destinations, customer portal configuration or live charges were created by this PR. A sandbox and server environment configuration are still required for actual integration verification.

## Setup

1. Merge the premium access migration and this Stripe migration, then apply them through the reviewed Supabase migration workflow. Do not rerun an already applied raw SQL migration.
2. In the Devhub CV Stripe Dashboard create/select a sandbox. Create an active monthly recurring Pro price with quantity one. Price/currency are business configuration, not chosen by this code.
3. Configure STRIPE_SECRET_KEY with the sandbox secret key, STRIPE_PRO_PRICE_ID with that sandbox price, and positive STRIPE_PRO_CHAT_LIMIT / STRIPE_PRO_EDITOR_LIMIT attempt allowances. Set NEXT_PUBLIC_SITE_URL to the canonical application origin. Set SUPABASE_SERVICE_ROLE_KEY only on the server; never expose it with a NEXT_PUBLIC prefix.
4. Create a sandbox webhook destination at /api/billing/webhook for checkout.session.completed, customer.subscription.created/updated/deleted, invoice.paid and invoice.payment_failed. Set its signing secret as STRIPE_WEBHOOK_SECRET. The SDK checks the signature against the exact raw body and its default timestamp tolerance. For local testing, use Stripe CLI forwarding and its local signing secret instead.
5. Enable the sandbox customer portal for payment method changes and cancellation at period end. Keep subscription product/price switching disabled while only one plan is supported.
6. Visit /admin/billing while signed in. Checkout shows the configured monthly test price; the page explains that attempts include failed/uncertain provider calls. Return from checkout does not grant Pro: the signed webhook must synchronize it. Assign an owned portfolio using the existing billing account API. Premium AI widget activation remains a later step.

Configuration missing or storage unavailable returns a generic error without logging secrets or payloads. Prices and limits are never accepted from client requests. Checkout and portal require confirmed authentication and same-origin POST. Customer IDs are stored server-side and never supplied by the browser. No card data enters this app.

## Synchronization and retries

billing_customers privately maps a verified account to its Stripe customer and persisted checkout idempotency key. A 90 second database lease serializes account checkout/synchronization. Stripe calls have no automatic retries and a 15 second per-call timeout. Checkout reuses an open session and rejects existing nonterminal subscriptions. The persistent key survives lost responses; rotation happens only after a known closed checkout. Customer creation also uses an account-specific idempotency key. Account rows/Stripe resources remain separate between deployment environments; do not reuse a database with different Stripe sandboxes.

Webhooks ignore unrelated event types and customers not mapped by this app. For known customers they acquire the account lease and fetch current subscription state rather than trusting an old event payload. This handles out-of-order delivery; competing/busy or failed requests return 503 for Stripe retry. A fenced RPC atomically updates entitlements and the event receipt. Expired workers cannot commit over a newer worker, and duplicate receipts are idempotent. Leases release best effort and expire after crashes. The RPC is SECURITY INVOKER with an empty search path, callable only by service_role. Browser roles have no access to customer mappings/receipts.

Only a single configured-price, quantity-one test subscription with active/trialing status receives allowances. Past due or unsupported states deny access. Multiple subscriptions or paginated ambiguity fail for operational review. Periods come from the subscription item; scheduled cancellation retains access until Stripe reports the actual ended state. Entitlement expiry independently denies access even if a renewal webhook is delayed. No refund, tax registration, trial, discount or live payment policy is provisioned here. Set those policies before a future live launch.

## Verification limits

Unit tests mock Stripe and execute migration lease/idempotency/privilege behavior in PGlite. They are not a real checkout or multi-connection contention test. Before launch verify sandbox checkout, duplicate clicks, webhook replay/reordering, invalid signatures, failed payments, renewal with test clocks, cancellation, portal return, cross-account isolation and unavailable storage. Check the mapped customer and entitlements in your own sandbox/database. Do not enable live keys by merely removing the test guard.
