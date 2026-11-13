# Documentation

## When to read

Read this first when you do not yet know which guide matches the task. It points at the hub pages, feature guides, current Studio workflows, and reference notes.

Start with the hub guides, then dig into feature or reference pages as needed. Product inventory lives in [features](features.md); package boundaries live in [architecture](architecture.md). Studio notes are indexed in [dev-studio](dev-studio/README.md). Fitness notes are indexed in [fitness-app](fitness-app/README.md).

## Hubs

| Guide                             | Read it for                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| [Features](features.md)           | Current capabilities, user flows and limitations             |
| [Architecture](architecture.md)   | Package boundaries, data flow and trust boundaries           |
| [Conventions](conventions.md)     | TypeScript, React, validation and dependency rules           |
| [Testing](testing.md)             | Verification commands, coverage and debugging                |
| [Observability](observability.md) | Logging baseline, Sentry adoption plan and incident response |

## Features

| Guide                                                          | Read it for                                          |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| [Personal workspaces](dev-studio/multiuser-cvs.md)             | Profile setup, publication and private downloads     |
| [Google login](dev-studio/google-login.md)                     | Supabase Google OAuth and workspace access           |
| [Managed portfolios](dev-studio/managed-portfolios.md)         | Administrator portfolios and ownership transfer      |
| [CV import](dev-studio/cv-import.md)                           | Optional CV extraction into portfolio drafts         |
| [Editor workflow](dev-studio/editor-workflow.md)               | Guided setup, tab-local recovery and AI field review |
| [Section system](dev-studio/section-system.md)                 | Section registry, ordering and compositions          |
| [Section templates](dev-studio/section-templates.md)           | Private template library and import/export           |
| [AI foundation](dev-studio/portfolio-ai-foundation.md)         | Public/owner knowledge and chat boundaries           |
| [Premium access](dev-studio/premium-access.md)                 | Entitlements and usage reservations                  |
| [Premium portfolio chat](dev-studio/premium-portfolio-chat.md) | Owner-enabled public chat widget                     |
| [Stripe billing](dev-studio/stripe-billing.md)                 | Test-only checkout, portal and webhooks              |

## Current Studio workflows

- [Guided portfolio setup](testing/manual/onboarding.md) and [profile menu](testing/manual/profile-menu.md)
- [Studio appearance](testing/manual/appearance.md) and [companion guide](testing/manual/companion-feature-guide.md)
- [Job Hunter](testing/manual/job-hunter.md) and [LinkedIn job-alert forwarding](testing/manual/linkedin-job-alerts.md)
- [Publication controls](testing/manual/publication.md), [scheduled publication](testing/manual/scheduled-publication.md) and [revision history](testing/manual/revision-history.md)

## Reference

| Guide                                                                 | Read it for                                |
| --------------------------------------------------------------------- | ------------------------------------------ |
| [Shared packages](reference/shared-packages.md)                       | Reuse boundaries for another app           |
| [Tailwind](reference/tailwind.md)                                     | Shared CSS pipeline and theme tokens       |
| [Section migration](reference/pageforge-section-migration.md)         | PageForge family mapping and compatibility |
| [Portfolio table RLS review](reference/portfolio-table-rls-review.md) | Historical security findings to revalidate |
