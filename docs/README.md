# Documentation

Start with the hub guides, then dig into feature or reference pages as needed. Product inventory lives in [features](features.md); package boundaries live in [architecture](architecture.md).

## Hubs

| Guide                             | Read it for                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| [Features](features.md)           | Current capabilities, user flows and limitations             |
| [Architecture](architecture.md)   | Package boundaries, data flow and trust boundaries           |
| [Conventions](conventions.md)     | TypeScript, React, validation and dependency rules           |
| [Testing](testing.md)             | Verification commands, coverage and debugging                |
| [Observability](observability.md) | Logging baseline, Sentry adoption plan and incident response |

## Features

| Guide                                                        | Read it for                                      |
| ------------------------------------------------------------ | ------------------------------------------------ |
| [Personal workspaces](features/multiuser-cvs.md)             | Profile setup, publication and private downloads |
| [Google login](features/google-login.md)                     | Supabase Google OAuth and workspace access       |
| [Managed portfolios](features/managed-portfolios.md)         | Administrator portfolios and ownership transfer  |
| [CV import](features/cv-import.md)                           | Optional CV extraction into portfolio drafts     |
| [Section system](features/section-system.md)                 | Section registry, ordering and compositions      |
| [Section templates](features/section-templates.md)           | Private template library and import/export       |
| [AI foundation](features/portfolio-ai-foundation.md)         | Public/owner knowledge and chat boundaries       |
| [Premium access](features/premium-access.md)                 | Entitlements and usage reservations              |
| [Premium portfolio chat](features/premium-portfolio-chat.md) | Owner-enabled public chat widget                 |
| [Stripe billing](features/stripe-billing.md)                 | Test-only checkout, portal and webhooks          |

## Reference

| Guide                                                         | Read it for                                |
| ------------------------------------------------------------- | ------------------------------------------ |
| [Shared packages](reference/shared-packages.md)               | Reuse boundaries for another app           |
| [Tailwind](reference/tailwind.md)                             | Shared CSS pipeline and theme tokens       |
| [Section migration](reference/pageforge-section-migration.md) | PageForge family mapping and compatibility |
| [Legacy RLS review](reference/legacy-rls-review.md)           | Historical security findings to revalidate |
