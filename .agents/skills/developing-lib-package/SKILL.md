---
name: developing-lib-package
description: Change validation, repositories, Supabase access, billing records,
  and domain services in @shared/lib. Use when editing a Zod schema, profile
  save, published read, username rule, section template import, CV import
  review, Google profile review, portfolio knowledge, Stripe sandbox client, or
  RLS policy test in packages/lib.
---

# Developing the lib package

`packages/lib` is `@shared/lib`. It owns Zod validation, domain services, repositories, and Supabase persistence. Callers import a specific entry point. The app feature that calls these modules still authorizes the request. A client-supplied id, username, or profile field is not authority.

Read [the file map](references/map.md) and [packages/lib/CATALOG.md](../../../packages/lib/CATALOG.md). Read [mydevstudio-business](../mydevstudio-business/SKILL.md) before changing ownership, publication, usernames, or transfers. Read [SECURITY.md](../../../SECURITY.md) before changing access checks.

Do not apply production migrations, publish a profile, or transfer ownership as a side effect of a code change.

## Where a data change goes

| Need                                             | Put it here                           | Leave it in the app                                    |
| ------------------------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| Shape of a valid profile, username, or section   | `src/domain`                          | Route status codes and HTTP bodies                     |
| Save, public read, owner provisioning            | `src/services` and `src/repositories` | `requireWorkspace`, origin check, response mapping     |
| Supabase browser, server, and middleware clients | `src/supabase`                        | The route file that calls them                         |
| Entitlement math and billing storage             | `@shared/billing`                     | Stripe Checkout session creation in `features/billing` |
| RLS behavior of a checked-in migration           | `src/supabase/rls/*.test.ts`          | `supabase/migrations` for the SQL itself               |

`ProfileService.save` checks `repository.isOwner`, parses `saveProfileSchema`, and writes with the revision. A null write throws `ProfileConflictError`. Do not skip the revision or overwrite a newer document. `ProfileAccessError`, `ProfileSetupError`, `ProfileNotFoundError`, and `ProfileUsernameError` are different failures. Map them at the route. Do not collapse them into one message.

A missing or private public read returns unavailable. It must not fall back to another person's profile.

## Change a persisted field

1. Update `PortfolioProfile` and defaults in `@shared/config`.
2. Update the schema in `src/domain/profile.ts` so a document that omits the field still parses.
3. Update import boundaries that can set the field: `cv-import.ts`, `pageforge-import.ts`, `google-profile.ts`, `section-templates.ts`, and `ai-edit.ts` when an assistant may propose it.
4. Reject invalid URLs and unexpected types in the schema. Accept external input as `unknown` and parse it.
5. Update the renderer and, if the PDF shows the field, `@shared/templates`.
6. Extend `src/domain/profile.test.ts` or the matching domain test. Include the absent-field case.

Username rules live in `src/domain/username.ts`: lowercase letters, numbers, single hyphens, length 3 to 50, and `reservedUsernames`. Reserved names include route segments such as `admin`, `api`, `auth`, and `p`. Add a reservation when a new top-level route would collide. `cvPath` and `editCvPath` build public paths. Do not trust a username from the body when the session already identifies the owner.

## Repositories and Supabase

`ProfileRepository` in `src/repositories/profile-repository.ts` is the contract. `src/repositories/supabase-profile-repository.ts` is the Supabase implementation and the `@shared/services/profile-repository` export. Keep owner isolation in the query and in RLS. Tests under `src/supabase/rls` describe policy behavior. They do not connect to production and they do not run migrations.

There is no Prisma client. Do not add one.

`src/supabase/client.ts`, `server.ts`, and `middleware.ts` build clients. Do not put a service-role key in a browser path. Public configuration names belong in `.env.example`. Values stay out of source and logs.

## Billing

Entitlements, summaries, Stripe sandbox client, and repository code live in `@shared/billing`. Checkout, portal, webhook signature checks, and the public price response are the app's `features/billing` gateway. Change both sides when the entitlement a customer receives changes. Do not log Stripe payloads or raw request bodies.

## Knowledge, import, and edits

| Module                          | Rule                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `portfolio-knowledge.ts`        | Public and owner projections differ. Owner-only knowledge is not visitor chat context |
| `cv-import.ts` and `cv-file.ts` | Review and file checks. The model extracts; this module validates. No CV text in logs |
| `ai-edit.ts`                    | Proposals are validated before any save. The model does not write the profile         |
| `google-profile.ts`             | Reviewed Google fields. Consent and scopes live in `@shared/auth`                     |
| `section-templates.ts`          | Import and export of templates. Templates are not stored inside the published profile |

## Add a public entry point

`package.json` `exports` lists exact files. There is a root `main` of `src/index.ts`, but callers should use the subpath that matches the catalog, such as `@shared/lib/profile` or `@shared/lib/profiles`. When you add a module:

1. Export from a stable file under `src/domain`, `src/services`, `src/repositories`, or `src/supabase`.
2. Add the subpath to `exports`.
3. Add a catalog row.
4. Run `pnpm check:exports`.

Do not add a deep import from `apps/my-dev-studio` into a file that is not exported.

## Tests

Colocate `module.test.ts` next to `module.ts`. Start with `describe`. Domain tests should cover a valid document, a rejected document, a legacy document, and the access or conflict error when the service owns that behavior.

```sh
pnpm --filter @shared/lib typecheck
pnpm exec vitest run --project unit packages/lib/src/domain/profile.test.ts
pnpm exec vitest run --project unit packages/lib/src/supabase/rls/managed-rls.test.ts
```

RLS tests are not a substitute for an app route test. If the route's status code changes, test `apps/my-dev-studio/app/**/route.test.ts` as well.

## Related skills

- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the auth package](../developing-auth-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
- [Business rules](../mydevstudio-business/SKILL.md)
