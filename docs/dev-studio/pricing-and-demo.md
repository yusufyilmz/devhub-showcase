# Plans and demo testing

The homepage now compares Free portfolio/CV features with optional Pro assistants. Pro remains a Stripe sandbox preview, not a live paid launch. The displayed monthly test price comes from the configured Stripe price; no amount is hardcoded. The current plan allowances come from server configuration. An unavailable pricing service leaves Free usable and shows a neutral fallback. The subscription page repeats price/allowance details and the editor links to plan/usage settings.

## Public pricing boundary

GET /api/billing/pricing exposes only test price amount/currency/interval and configured attempt limits. It never returns Stripe keys, customer IDs or subscription records. Valid results may be cached for five minutes; errors use no-store. A short Stripe timeout prevents long public pricing requests. Live, inactive, nonmonthly and nonflat prices are rejected. UI amounts respect currency decimal rules, including Stripe's ISK/UGX special representation. Prices remain test values; no tax, trial or real payment policy is launched here.

## Private deployed demo

Use a separate confirmed Google account with an untouched private starter workspace. The demo content is a fictional Alex Morgan portfolio with sample experience, projects, education, skills/languages and the complete section library: all 47 registered types, all 10 custom renderer layouts, a hero background and a feature checklist (57 custom sections in total). The six standard career sections remain available. Social links are clearly labeled placeholders; newsletter and contact samples do not provision external services. One project contains a private marker for testing public context filtering. No shared password, alternate login bypass or administrator role is created. The normal Google session remains the sign-in authority.

The deployed demo setup is an explicit administrative action. Its temporary Pro test grant lasts seven days, with 20 visitor chat attempts and 5 private assistant attempts. These are demo-specific limits, separate from the configured sandbox subscription product. Public sharing and visitor chat start disabled. No automatic test requests call OpenAI. Requests you choose to run use the real configured provider and consume its budget. Completing Stripe sandbox checkout later synchronizes the actual sandbox plan; it is a separate billing test, not proof of the manual demo grant.

For future setup, the server-only helper is:

```sh
pnpm --filter web demo:seed --owner-id VERIFIED_ACCOUNT_UUID
pnpm --filter web demo:seed --owner-id VERIFIED_ACCOUNT_UUID --apply --grant-pro
```

Run with server environment configuration in the web app's ignored .env.local or process environment. A Stripe test key is required. The first command is a dry run. Existing grants, real portfolios, published records, nonempty workspaces, non-Google accounts and the main portfolio are rejected. The helper is not a public HTTP endpoint. Its final profile write checks ownership, revision and publication again to avoid overwriting a concurrent edit. It never resets usage or existing grants.

The helper uses multiple API writes. If storage fails after the profile is seeded, inspect the private profile and billing rows before repair; it deliberately refuses automatic retries that could overwrite an existing grant or extend trial access. Do not put service keys, private email addresses or actual account IDs in Git. The initial deployed demo was provisioned in a guarded database transaction, independently of this reusable helper.

## Feature checklist

Sign in as the demo account, then:

1. Edit fictional introduction/career data and save. Reload and confirm the saved revision.
2. Switch among all layouts/themes and portfolio/CV languages. Authored prose is not translated automatically.
3. Change section renderers/order, add a custom section and save a private section template. Export/import a configuration and review before applying it.
4. Download the private CV and check its content/layout.
5. Open AI assistant, request a small change, review before/after values, apply to the draft, undo and save explicitly only when ready. Check studio usage in subscription settings.
6. If you choose to publish fictional content, enable visitor chat in subscription settings and test it from a signed-out browser. The confidential sample marker must not appear in answers/context. Turn sharing and chat off again afterward if desired.
7. Use Stripe sandbox checkout with a test card, verify the signed webhook updates the entitlement, open the customer portal and test payment method changes/cancellation. No live key is accepted.
8. Check an unrelated account cannot edit the demo or read its private assistant data. A missing/private public URL should remain 404.

A manual demo grant does not verify Stripe checkout, renewals or webhooks. Local mock tests do not verify real model accuracy, external provider availability or mobile visual behavior. Test those explicitly and report each outcome separately.
