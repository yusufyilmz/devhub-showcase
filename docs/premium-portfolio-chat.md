# Premium portfolio chat

The reusable PortfolioChat component lives in packages/components, with a small app transport adapter. Published named portfolios across all four layouts can display it when their current owner has an active assigned Pro entitlement and explicitly enabled chat. Free, private, transferred, unassigned or disabled portfolios cannot invoke it. The existing main portfolio assistant retains its legacy configuration and limits; it is not charged twice.

## Owner setup

Apply premium_chat_widget after the billing migrations. Existing assignments default to disabled. In /admin/billing, an active Pro owner can enable chat for their own portfolio. This assigns that portfolio and sets chat_enabled. Disabling removes the assignment, including when a subscription is no longer active. Usage is account scoped and is not reset by enabling/disabling or reassigning. Managed temporary records have no owner and are ineligible. Enabling does not publish a private portfolio.

The billing page shows reserved chat attempts and the period allowance. Stripe sandbox checkout remains independently configured and still needs actual end-to-end verification. This change neither applies production SQL nor grants subscriptions.

## Request boundaries

/api/portfolio-chat accepts only username, message, sessionId and requestId. The server validates origin and input size, reloads the current published profile, constructs whitelisted public knowledge and resolves ownership/entitlement server-side. No client profile, owner ID, prompt or plan is trusted. Anonymous visitors do not need accounts. A service client is server-only and independent of Stripe configuration. No model request is made for display checks.

Requests pass visitor/portfolio/global Redis abuse limits before the atomic database reservation. The reservation RPC also checks chat_enabled while holding its assignment lock, preventing stale UI availability from granting access. Each request reserves one attempt; provider failures, aborts and uncertain requests still count. Missing configuration, storage failures and allowance exhaustion fail closed with a generic visitor error, without logging prompts or secrets. The owner billing API remains private/no-store. Public chat responses use no-store and do not expose billing/customer data.

## Answers and browser state

Responses use the shared public PortfolioChatModel, bounded to 2,000 question characters, 800 output tokens, no external tools, no automatic retries and a 45 second request budget. Answers come from visible saved portfolio content and acknowledge absent facts. This version returns a completed plain-text answer; token streaming and claim-level citations are not implemented. The visitor disclosure explains AI fallibility and that questions are sent to OpenAI. Prior messages are displayed locally but are not sent as trusted profile facts or conversational context.

The modal uses native dialog focus containment, Escape/Close, explicit labels, pending/error states and responsive CSS. Plain text is rendered as text, never HTML. Session storage is scoped to portfolio ID and saved revision and retains at most 20 messages; each opening gets a fresh rate-limit session ID. Portfolio/global limits prevent session rotation from giving unlimited requests. Clearing the conversation clears that scope. Closing aborts the client request, though already reserved/provider-started work may still incur cost. Storage can be disabled without blocking chat. A saved revision change starts a separate history; it does not erase information already downloaded by a visitor.

## Verification

Domain/API integration tests mock provider/network boundaries and verify server-built context, active grants, disabled state, no fallback, quota denial and forbidden client context. SQL tests execute the migrations and owner opt-in checks in PGlite. Component tests cover question bounds, plain-text rendering, clear behavior and history separation. These tests do not prove a live paid provider response, Stripe checkout, production RLS deployment or multi-connection contention behavior. Browser checks depend on Chromium being available.
