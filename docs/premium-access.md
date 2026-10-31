# Premium access foundation

Step 2 adds account entitlements, explicit portfolio assignments and durable usage reservations. Stripe, pricing/settings UI and premium widget activation remain later steps. Existing CV import and the main portfolio's legacy chat are unchanged.

Missing grants mean Free. Pro requires active/trialing status and a current start-inclusive, end-exclusive billing period. Limits are separate for portfolio_chat and studio_assistant. No prices, trials or paid grants are seeded. A future verified Stripe webhook must provision limits and periods; user metadata and portfolio JSON never grant Pro.

An account can assign one owned portfolio. Temporary managed portfolios are ineligible. RLS protects account reads and assignment writes. Clients cannot change entitlements/usage or execute the reservation RPC. A transferred portfolio loses access immediately because reservations recheck ownership. Public chat requires publication. Assignment changes do not reset account usage.

The SECURITY INVOKER reservation RPC is restricted to service_role and uses an empty search path. It locks the entitlement before counting indexed account/period/feature usage and inserting a request UUID. This serializes concurrent requests and period updates. Duplicate UUIDs deny another provider invocation. Failures and uncertain reservations count as attempts, because a timeout can still incur provider costs. Outcome recording is best effort and stores no prompts or answers. Period rollover retains history. This is attempt accounting, not token/currency billing or exactly-once provider execution.

The shared billing repository accepts a session client for summaries/assignment. Its separate usage adapter requires trusted server credentials. No privileged client is created here. Future studio callers must authenticate ownership; public callers must resolve account/profile server-side and apply visitor/global abuse limits before reservation. The reusable runPremiumOperation wrapper invokes the provider only after reservation succeeds, never retries, and never refunds uncertain attempts automatically.

GET /api/admin/billing returns the confirmed account's plan, assignment and usage. PUT accepts only a profileId or null, with origin/auth/schema/size checks. Identity comes from the session. Responses are private/no-store and storage failures deny access. Summaries are for display; reservation is the execution authority.

Apply the committed migration through the reviewed Supabase workflow before using this API. Production SQL has not been applied. Existing features do not require these tables. Prisma remains disabled. Tests execute the migration with separate database roles in PGlite; multi-connection PostgreSQL contention testing is still needed before premium launch. The next step is Stripe test-mode checkout, portal and verified/idempotent subscription webhooks.
