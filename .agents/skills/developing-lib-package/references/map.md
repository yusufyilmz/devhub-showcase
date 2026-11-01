# Lib package map

Package `@shared/lib` in `packages/lib`. Import a catalogued subpath.

## Domain

| Export                            | File                                |
| --------------------------------- | ----------------------------------- |
| `@shared/lib/profile`             | `src/domain/profile.ts`             |
| `@shared/lib/username`            | `src/domain/username.ts`            |
| `@shared/lib/section`             | `src/domain/section.ts`             |
| `@shared/lib/section-templates`   | `src/domain/section-templates.ts`   |
| `@shared/lib/pageforge-import`    | `src/domain/pageforge-import.ts`    |
| `@shared/lib/cv-import`           | `src/domain/cv-import.ts`           |
| `@shared/lib/cv-file`             | `src/domain/cv-file.ts`             |
| `@shared/lib/ai-edit`             | `src/domain/ai-edit.ts`             |
| `@shared/lib/google-profile`      | `src/domain/google-profile.ts`      |
| `@shared/lib/portfolio-knowledge` | `src/domain/portfolio-knowledge.ts` |

## Services and persistence

| Export                           | File                                              | Use                                                                              |
| -------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@shared/lib/profile-service`    | `src/services/profile-service.ts`                 | Owner check, parse, revision save                                                |
| `@shared/lib/published-profile`  | `src/services/published-profile.ts`               | Public read                                                                      |
| `@shared/lib/user-profile`       | `src/services/user-profile.ts`                    | Owner provisioning                                                               |
| `@shared/lib/profile-repository` | `src/repositories/supabase-profile-repository.ts` | Supabase repository                                                              |
| `@shared/lib/profile-errors`     | `src/repositories/profile-repository.ts`          | Access, conflict, setup, not-found, username errors and the repository interface |
| `@shared/lib/portfolio`          | `src/services/portfolio`                          | Portfolio resources                                                              |
| `@shared/lib/services`           | `src/services/index.ts`                           | Service barrel                                                                   |
| `@shared/lib/supabase`           | `src/supabase`                                    | Clients                                                                          |
| `@shared/lib/types`              | `src/types`                                       | Database and chat types                                                          |
| `@shared/lib/errors`             | `src/errors`                                      | Generic request errors                                                           |
| `@shared/lib/utils`              | `src/utils`                                       | Date and domain helpers                                                          |
| `@shared/lib/cache`              | `src/cache`                                       | Service-worker cache manager, not Redis                                          |

Redis rate limits are `@shared/cache`. This package's `src/cache` is a different helper. Do not store rate-limit counters here.

## Billing

Billing lives in `@shared/billing`. See [packages/billing/CATALOG.md](../../../../packages/billing/CATALOG.md). App checkout and webhooks stay in `apps/my-dev-studio/features/billing`.

## Errors from profile access

| Error                  | Meaning                                 |
| ---------------------- | --------------------------------------- |
| `ProfileAccessError`   | Caller is not the owner                 |
| `ProfileConflictError` | Revision is stale                       |
| `ProfileSetupError`    | Storage is not configured               |
| `ProfileNotFoundError` | Private or missing. No fallback profile |
| `ProfileUsernameError` | Username is taken                       |

## RLS tests

`src/supabase/rls/` contains `section-template-rls.test.ts`, `managed-rls.test.ts`, `premium-chat-migration.test.ts`, `multiuser-rls.test.ts`, and `admin-rls.test.ts`. Read the migration they cite before editing the assertion. Do not point them at a live project.

## Other source

`src/services/resources` has resource helpers for projects, experience, skills, and related records. `src/validation` has older project schema helpers. Prefer `src/domain/profile.ts` for the portfolio document. `src/axios` is a legacy client. New portfolio persistence goes through the Supabase repository.

## Checks

```sh
pnpm --filter @shared/lib typecheck
pnpm exec vitest run --project unit packages/lib
pnpm check:exports
```
