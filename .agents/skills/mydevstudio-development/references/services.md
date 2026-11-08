# Shared services and validation

`@shared/lib` owns shared backend services, repositories, database clients, validation schemas, and database/chat types. `@shared/utils` owns generic HTTP, date, conversion, error, cache and logging helpers. Profile facts and localized portfolio copy remain in `@shared/config`.

Use [the services catalog](../../../../packages/lib/CATALOG.md) for current public entry points. Keep implementations and tests grouped by domain inside `src/services/`, `src/repositories/`, and `src/schemas/`. Common models live in `src/types/`; generated Supabase types and database tests live in `src/db/`.

- App routes verify caller identity and origin, then bind validated configuration and verified identities to shared factories. Shared implementations never import apps or app env modules.
- Preserve owner filters, publication checks, revision conflicts and bounded input. Public reads must never fall back to another person's private data.
- Profile validation is `@shared/lib/profiles`; section schemas are `@shared/lib/section`. Read shared database/chat types from `@shared/lib/types` and typed clients from `@shared/lib/supabase`.
- Preserve saved documents that omit newer fields. Change persisted fields in their models, validators, imports/saves and renderers together.
- Do not publish, transfer ownership, change roles or run production migrations as a side effect of code work. Use fictional fixtures; never log raw profiles, prompts, credentials or provider responses.
- Use relative imports inside the owning package, declared dependencies across packages, and shallow public export paths. Do not restore a forwarding library package.

Run `pnpm check`, the affected unit/API tests, and production builds when module boundaries can affect bundling. Schema/RLS tests use local fixtures and do not verify production database settings.
