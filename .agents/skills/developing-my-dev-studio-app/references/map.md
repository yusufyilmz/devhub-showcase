# MyDevStudio app map

App package `my-dev-studio` in `apps/my-dev-studio`.

## App routes

| Path                                         | Role                                             |
| -------------------------------------------- | ------------------------------------------------ |
| `app/page.tsx`                               | Platform home                                    |
| `app/layout.tsx`                             | Root document, fonts, `globals.css`, `PageShell` |
| `app/(site)/layout.tsx`                      | Site segment layout                              |
| `app/(site)/reviews/page.tsx`                | Reviews page                                     |
| `app/[username]/page.tsx`                    | Published profile                                |
| `app/[username]/edit/page.tsx`               | Owner editor                                     |
| `app/[username]/cv.pdf/route.ts`             | Published PDF                                    |
| `app/[username]/share.png/route.tsx`         | Share image                                      |
| `app/[username]/icon.svg/route.ts`           | Icon                                             |
| `app/studio/page.tsx`                        | Studio entry                                     |
| `app/login/page.tsx`                         | Sign in (Google and email)                       |
| `app/studio/billing/page.tsx`                | Billing page                                     |
| `app/studio/layout.tsx`                      | Studio layout                                    |
| `app/studio/portfolios/page.tsx`             | Managed list                                     |
| `app/studio/portfolios/[id]/page.tsx`        | One managed portfolio                            |
| `app/studio/portfolios/[id]/cv.pdf/route.ts` | Guarded managed PDF                              |
| `app/auth/callback/route.ts`                 | Auth callback                                    |
| `app/p/[id]/page.tsx`                        | Compatibility profile                            |
| `app/p/[id]/cv.pdf/route.ts`                 | Compatibility PDF                                |
| `app/p/examples/[slug]/page.tsx`             | Public example                                   |
| `app/p/examples/[slug]/cv.pdf/route.ts`      | Example PDF                                      |
| `app/cv.pdf/route.ts`                        | Main portfolio PDF compatibility                 |
| `app/sitemap.ts`                             | Sitemap                                          |
| `app/robots.ts`                              | Robots                                           |
| `app/actions.ts`                             | Server actions                                   |
| `app/error.tsx`, `app/not-found.tsx`         | App error and not-found UI                       |

## API routes

| Path                                           | Feature it should call                             |
| ---------------------------------------------- | -------------------------------------------------- |
| `app/api/admin/profile/route.ts`               | `features/admin` and `@shared/lib` profile service |
| `app/api/admin/session/route.ts`               | `features/admin`                                   |
| `app/api/admin/google/route.ts`                | Auth handlers                                      |
| `app/api/admin/google-profile/route.ts`        | Google profile import                              |
| `app/api/admin/cv/route.ts`                    | Portfolio CV response                              |
| `app/api/admin/cv-import/route.ts`             | Cache limit, then assistant and lib review         |
| `app/api/admin/assistant/route.ts`             | Cache limit, then edit model                       |
| `app/api/admin/billing/route.ts`               | `features/billing`                                 |
| `app/api/admin/managed/route.ts`               | `features/management`                              |
| `app/api/admin/managed/[id]/route.ts`          | One managed portfolio                              |
| `app/api/admin/managed/[id]/transfer/route.ts` | Explicit transfer                                  |
| `app/api/admin/section-templates/route.ts`     | Section template library                           |
| `app/api/billing/checkout/route.ts`            | Stripe checkout                                    |
| `app/api/billing/portal/route.ts`              | Stripe portal                                      |
| `app/api/billing/webhook/route.ts`             | Signed webhook                                     |
| `app/api/billing/pricing/route.ts`             | Public pricing                                     |

## Features

| Folder                | Representative files                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `services/admin`      | `get-auth.ts`, `get-auth-handlers.ts`, `get-google-profile.ts`, `get-local-test-login.ts`, `get-billing.ts` |
| `features/admin`      | `owner-edit-link.tsx`                                                                                       |
| `services/management` | `get-portfolios.ts`, `get-api.ts`                                                                           |
| `features/management` | `managed-workspace.tsx`                                                                                     |
| `features/billing`    | `gateway.ts`, `handler.ts`, `client.ts`, `public-pricing.ts`, `premium-configuration.ts`, `errors.ts`       |

## Scripts and support

| Path                        | Use                                                    |
| --------------------------- | ------------------------------------------------------ |
| `scripts/seed-demo.mjs`     | Local demo seed. Not production                        |
| `scripts/demo-sections.mjs` | Demo section data                                      |
| `public/examples`           | Example assets                                         |
| `next.config.mjs`           | Next config. Do not hand-edit generated `.next` output |

Import alias `@/` points at the app. Shared packages use `@shared/*`.

## Checks

```sh
pnpm --filter my-dev-studio typecheck
pnpm --filter my-dev-studio build
pnpm exec vitest run --project unit apps/my-dev-studio
```

## Route-family bindings

Homepage composition is `app/page.tsx`. Home links and the account menu live in `services/home`. Site defaults and presentation are `services/site/get-site.ts` and `services/site/get-presentation.ts`. Username profile, resources, access, and the engineer portfolio live in `services/portfolio`. Review and chat bindings live in `services/review` and `services/chat`. Publication, history, jobs, calendar, trello, and CV helpers live in the matching `services` folder. Workspace auth and managed portfolio access live in `services/admin` and `services/management`.
