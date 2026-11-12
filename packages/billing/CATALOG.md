<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# Billing catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "plan" --package @shared/billing --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/billing`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.ai/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

BillingSettings imports its colocated billing stylesheet, which owns the bounded
page layout, heading hierarchy, explanatory text spacing, and usage-card styling.

Stripe sandbox billing, entitlements, and studio subscription UI for `@shared/billing`. Import a specific entry point.

| Export                       | Path                      | Use                                                          |
| ---------------------------- | ------------------------- | ------------------------------------------------------------ |
| `@shared/billing`            | `src/index.ts`            | Entitlements, summaries, messages, premium operation helper  |
| `@shared/billing/types`      | `src/types.ts`            | `BillingRequest`                                             |
| `@shared/billing/server`     | `src/server/index.ts`     | Repository, Stripe client, gateway, pricing, AI config check |
| `@shared/billing/client`     | `src/client/index.ts`     | Service-role Supabase client for billing                     |
| `@shared/billing/handler`    | `src/handler/index.ts`    | `billingPost` for checkout and portal routes                 |
| `@shared/billing/config`     | `src/config/index.ts`     | Stripe sandbox configuration                                 |
| `@shared/billing/provider`   | `src/provider/index.ts`   | `BillingProvider`, `useBillingRequest`, `useAccountStatus`   |
| `@shared/billing/components` | `src/components/index.ts` | Subscription settings UI                                     |
| `@shared/billing/middleware` | `src/middleware.ts`       | `sameOrigin` for billing POST routes                         |

Import `@shared/billing-repository` resolves to `src/server/repository.ts` via the root TypeScript paths map.

## Generated package reference

| Import                       | Source / condition          | Declared symbols                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/billing`            | `./src/index.ts`            | `BillingActionError`, `billingSummarySchema`, `entitlementSchema`, `entitlementSummary`, `featureSchema`, `premiumFeatureStatus`, `runPremiumOperation`, `type BillingSummary`, `type Entitlement`, `type PlanAccess`, `type PremiumFeature`, `type PremiumUsage`                                                                                 |
| `@shared/billing/client`     | `./src/client/index.ts`     | `billingServiceClient`                                                                                                                                                                                                                                                                                                                            |
| `@shared/billing/components` | `./src/components/index.ts` | `AccountOverview`, `BillingControls`, `BillingSettings`, `ChatSettings`, `StudioPlanDetails`, `type AccountStatus`                                                                                                                                                                                                                                |
| `@shared/billing/config`     | `./src/config/index.ts`     | `stripeConfiguration`                                                                                                                                                                                                                                                                                                                             |
| `@shared/billing/handler`    | `./src/handler/index.ts`    | `billingPost`                                                                                                                                                                                                                                                                                                                                     |
| `@shared/billing/middleware` | `./src/middleware.ts`       | `sameOrigin`                                                                                                                                                                                                                                                                                                                                      |
| `@shared/billing/provider`   | `./src/provider/index.ts`   | `BillingProvider`, `defaultBillingRequest`, `useAccountStatus`, `useBillingRequest`                                                                                                                                                                                                                                                               |
| `@shared/billing/server`     | `./src/server/index.ts`     | `BillingRepository`, `ExistingSubscriptionError`, `PremiumUsageRepository`, `StripeBilling`, `billingGateway`, `billingServiceClient`, `checkout`, `createStripe`, `portal`, `premiumAiConfigured`, `publicPricing`, `stripeConfiguration`, `synchronize`, `type BillingClient`, `type StripeEvent`, `type SubscriptionState`, `withBillingLease` |
| `@shared/billing/types`      | `./src/types.ts`            | `type BillingRequest`                                                                                                                                                                                                                                                                                                                             |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script         | Command                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `build`        | `tsdown`                                                                  |
| `clean`        | `node -e "require('node:fs').rmSync('dist',{recursive:true,force:true})"` |
| `format`       | `biome format --write .`                                                  |
| `format:check` | `biome format .`                                                          |
| `lint`         | `biome lint .`                                                            |
| `lint:check`   | `biome lint .`                                                            |
| `lint:fix`     | `biome lint --write .`                                                    |
| `typecheck`    | `tsc --noEmit`                                                            |
| `types:check`  | `pnpm typecheck`                                                          |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/auth`              | `workspace:*`    | dependencies    |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/env`               | `workspace:*`    | dependencies    |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@supabase/supabase-js`     | `catalog:`       | dependencies    |
| `react`                     | `catalog:`       | dependencies    |
| `stripe`                    | `catalog:`       | dependencies    |
| `zod`                       | `catalog:`       | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `@types/react-dom`          | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
