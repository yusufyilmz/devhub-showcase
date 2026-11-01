# Architecture

The task is the common domain entity. A parent-child relationship expresses categories, plans, activities and subtasks; typed details express the differences between a set, meal, water entry or generated shopping item. A task's scope distinguishes reusable templates, daily snapshots and generated weekly tasks. Historical snapshots preserve the instructions and ingredient rows used at the time.

## Application boundaries

`TaskService` handles tree operations, completion, logging and archive rules. `ScheduleService` creates daily snapshots from rotation, weekdays and overrides. `MealPlanningService` resolves seven days of meals and ingredient choices. `ShoppingListService` aggregates compatible ingredient quantities. `WeeklyPlanningService` composes those outputs into deterministic task trees. `WorkspaceService` validates the persistence boundary. `AgendaService` projects scheduled and generated tasks into chronological events and reschedules individual occurrences while preserving their subtree and meal choices. `features/agenda` shares event rows between daily views and `features/calendar`; URL navigation is isolated in its own hook.

React components render these models and call services; they do not contain SQL. The workspace hook handles loading, saving, undo and visible errors. The `WorkspaceGateway` HTTP implementation is read-only by default. It unlocks local mutation controls only when the server confirms owner permissions. `WorkspaceAccessService` binds public reads and authorized writes to the configured `WORKSPACE_OWNER_ID`; a browser cannot choose the persistence owner. Supabase Auth verifies the shared cookie session, or a bearer token, on the server before identity is used. Public reads use a read-only repeatable-read transaction and never seed, import or update records. Only owner loads may initialize the workspace.

Repository contracts separate storage from application behavior. `DrizzleWorkspaceRepository` coordinates a transaction; task and planning repositories map their own records. Dependencies are passed through constructors rather than looked up inside domain rules. New persistence adapters can implement the same contracts without changing scheduling or shopping logic.

## Relational storage

Eight ORM tables store workspace settings/revision, tasks, meal ingredients, schedules, diet rotation, date overrides, meal choices and weight history. Composite owner/task keys and parent foreign keys enforce ownership of the hierarchy. Task detail JSON contains only the typed per-task payload; the complete workspace is not stored as a JSON blob.

For this personal app, a save validates and replaces the owner's aggregate records within one transaction. An advisory lock serializes initialization, and the expected revision prevents stale overwrites. Failed writes roll back both records and revision. Tasks are inserted in parent-before-child order. This deliberately favors simple atomic saves over partial per-entity commands; a larger collaborative system should introduce incremental commands and narrower transactions.

The Supabase pooler connection is server-only and may use a role that bypasses RLS. Explicit owner filters are mandatory in every repository read and mutation. Database policies independently protect direct authenticated access; anonymous grants are revoked. Tests cover both repository isolation and database role policies.

## Planning invariants

- Progress counts actionable leaves once; grouping tasks do not inflate totals.
- Template edits affect future unmaterialized days. Saved day snapshots retain their original instructions.
- A calendar override changes only its date, without shifting the diet rotation.
- Weekly generation is deterministic. Regeneration preserves completion only when an item's contents are unchanged.
- Alternatives require explicit selection. Missing quantities remain unknown; ranges retain both bounds.
- Ingredients aggregate only when identity, unit and known/unknown quantity status agree.
- Archived templates remain available as historical references.

`tests/persistence.test.ts` runs the actual migrations and ORM repositories against embedded PostgreSQL. Domain tests independently exercise the scheduling and aggregation rules. Supabase deployment credentials are not required for these tests.

## Authentication and sharing

The public API intentionally serves the configured owner's saved workspace to anonymous visitors. It serves no credentials or session metadata. State responses are uncached and distinguish view permissions from domain data. The server compares the verified Supabase user ID to the configured owner before each mutation. Direct anonymous table access remains disabled.

The browser and server use the shared Supabase cookie session from `@shared/auth`. Passwords are never persisted, and sign-in responses do not return tokens. The server accepts that cookie or a verified bearer token, then compares the user id with `WORKSPACE_OWNER_ID`. Read-only visitors poll the shared workspace while the tab is visible; auth changes reload access. The dedicated `/preview` route uses the same live API with forced read-only controls and omits the session cookie.

## Development tooling

Biome formats and lints source files using its recommended preset. Non-null assertions remain allowed for validated task graphs and test fixture lookups; CSS specificity suppressions document the existing responsive/theme cascade. Vitest runs the domain, persistence, rendering, API-access and session tests with the same `@/` alias as the application.
