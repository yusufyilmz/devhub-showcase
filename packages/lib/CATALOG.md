# Lib catalog

Validation, repositories, and domain services for `@shared/lib`. Import a specific entry point. Authorization stays in the app feature that calls these modules.

| Export                            | Path                                              | Use                                   |
| --------------------------------- | ------------------------------------------------- | ------------------------------------- |
| `@shared/lib/profile`             | `src/domain/profile.ts`                           | Profile schema and validation         |
| `@shared/lib/username`            | `src/domain/username.ts`                          | Username schema and paths             |
| `@shared/lib/section`             | `src/domain/section.ts`                           | Section schema                        |
| `@shared/lib/section-templates`   | `src/domain/section-templates.ts`                 | Template import and export            |
| `@shared/lib/pageforge-import`    | `src/domain/pageforge-import.ts`                  | PageForge conversion                  |
| `@shared/lib/cv-import`           | `src/domain/cv-import.ts`                         | Reviewed CV import                    |
| `@shared/lib/cv-file`             | `src/domain/cv-file.ts`                           | Upload size and type checks           |
| `@shared/lib/ai-edit`             | `src/domain/ai-edit.ts`                           | Edit proposal validation              |
| `@shared/lib/google-profile`      | `src/domain/google-profile.ts`                    | Google profile review                 |
| `@shared/lib/portfolio-knowledge` | `src/domain/portfolio-knowledge.ts`               | Public and owner assistant context    |
| `@shared/lib/portfolio`           | `src/services/portfolio`                          | Portfolio resources                   |
| `@shared/lib/profile-service`     | `src/services/profile-service.ts`                 | Profile save service                  |
| `@shared/lib/published-profile`   | `src/services/published-profile.ts`               | Public profile reads                  |
| `@shared/lib/user-profile`        | `src/services/user-profile.ts`                    | Owner profile provisioning            |
| `@shared/lib/profile-repository`  | `src/repositories/supabase-profile-repository.ts` | Supabase profile repository           |
| `@shared/lib/profile-errors`      | `src/repositories/profile-repository.ts`          | Profile access and conflict errors    |
| `@shared/lib/billing`             | `src/billing`                                     | Entitlements, summaries, and messages |
| `@shared/lib/billing-repository`  | `src/billing/repository.ts`                       | Billing storage                       |
| `@shared/lib/stripe`              | `src/billing/stripe.ts`                           | Stripe sandbox client                 |
| `@shared/lib/supabase`            | `src/supabase`                                    | Supabase clients                      |
| `@shared/lib/services`            | `src/services`                                    | Service barrel                        |
| `@shared/lib/types`               | `src/types`                                       | Shared database and chat types        |
| `@shared/lib/errors`              | `src/errors`                                      | Generic request errors                |
| `@shared/lib/utils`               | `src/utils`                                       | Date and other domain helpers         |
| `@shared/lib/cache`               | `src/cache`                                       | Service worker cache manager          |
