# Billing catalog

Billing access preserves confirmed past-due/canceled guidance after a grant becomes Free. Stripe reconciliation reads current subscription state; webhook events include delayed payment and pause/resume transitions. `pnpm test:billing:postgres` verifies the existing reservation/lease RPCs through independent connections in a disposable PostgreSQL cluster.

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
