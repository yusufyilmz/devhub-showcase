# MyDevStudio app map

App package `my-dev-studio` in `apps/my-dev-studio`.

## App routes

| Path                                        | Role                                             |
| ------------------------------------------- | ------------------------------------------------ |
| `app/page.tsx`                              | Platform home                                    |
| `app/layout.tsx`                            | Root document, fonts, `globals.css`, `PageShell` |
| `app/(site)/layout.tsx`                     | Site segment layout                              |
| `app/(site)/reviews/page.tsx`               | Reviews page                                     |
| `app/[username]/page.tsx`                   | Published profile                                |
| `app/[username]/edit/page.tsx`              | Owner editor                                     |
| `app/[username]/cv.pdf/route.ts`            | Published PDF                                    |
| `app/[username]/share.png/route.tsx`        | Share image                                      |
| `app/[username]/icon.svg/route.ts`          | Icon                                             |
| `app/admin/page.tsx`                        | Studio entry                                     |
| `app/admin/login/page.tsx`                  | Login                                            |
| `app/admin/billing/page.tsx`                | Billing page                                     |
| `app/admin/layout.tsx`                      | Admin layout                                     |
| `app/admin/portfolios/page.tsx`             | Managed list                                     |
| `app/admin/portfolios/[id]/page.tsx`        | One managed portfolio                            |
| `app/admin/portfolios/[id]/cv.pdf/route.ts` | Guarded managed PDF                              |
| `app/auth/callback/route.ts`                | Auth callback                                    |
| `app/p/[id]/page.tsx`                       | Compatibility profile                            |
| `app/p/[id]/cv.pdf/route.ts`                | Compatibility PDF                                |
| `app/p/examples/[slug]/page.tsx`            | Public example                                   |
| `app/p/examples/[slug]/cv.pdf/route.ts`     | Example PDF                                      |
| `app/cv.pdf/route.ts`                       | Main portfolio PDF compatibility                 |
| `app/sitemap.ts`                            | Sitemap                                          |
| `app/robots.ts`                             | Robots                                           |
| `app/actions.ts`                            | Server actions                                   |
| `app/error.tsx`, `app/not-found.tsx`        | App error and not-found UI                       |

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
| `app/api/portfolio-chat/route.ts`              | `features/chat`                                    |
| `app/api/billing/checkout/route.ts`            | Stripe checkout                                    |
| `app/api/billing/portal/route.ts`              | Stripe portal                                      |
| `app/api/billing/webhook/route.ts`             | Signed webhook                                     |
| `app/api/billing/pricing/route.ts`             | Public pricing                                     |

## Features

| Folder                | Representative files                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `features/admin`      | `admin-auth.ts`, `auth-handlers.ts`, `google-profile-import.ts`, `owner-edit-link.tsx`                                                |
| `features/billing`    | `gateway.ts`, `handler.ts`, `client.ts`, `public-pricing.ts`, `premium-configuration.ts`, `errors.ts`                                 |
| `features/chat`       | `portfolio-chat.ts`, `premium-chat.ts`                                                                                                |
| `features/home`       | `home-page.tsx`, `home-links.ts`                                                                                                      |
| `features/management` | `managed-portfolios.ts`, `managed-api.ts`, `managed-workspace.tsx`, `create-portfolio.tsx`                                            |
| `features/platform`   | `platform.ts`, `site-url.ts`, `page-presentation.ts`, `studio-client.tsx`                                                             |
| `features/portfolio`  | `public-profile.ts`, `published-profile.ts`, `active-profile.ts`, `cv-response.ts`, `portfolio-metadata.ts`, `engineer-portfolio.tsx` |

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
