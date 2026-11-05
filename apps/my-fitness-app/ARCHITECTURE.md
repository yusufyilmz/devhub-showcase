# Architecture

The task is the common domain entity. A parent-child relationship expresses categories, plans, activities and subtasks; typed details express the differences between a set, meal, water entry or generated shopping item. A task's scope distinguishes reusable templates, daily snapshots and generated weekly tasks. Historical snapshots preserve the instructions and ingredient rows used at the time.

## Application boundaries

`TaskService` handles tree operations, completion, logging and archive rules. `ScheduleService` creates daily snapshots from rotation, weekdays and overrides. `MealPlanningService` resolves seven days of meals and ingredient choices. `ShoppingListService` aggregates compatible ingredient quantities. `WeeklyPlanningService` composes those outputs into deterministic task trees. `WorkspaceService` validates the persistence boundary. `AgendaService` projects scheduled and generated tasks into chronological events and reschedules individual occurrences while preserving their subtree and meal choices. `features/agenda` shares event rows between daily views and `features/calendar`; URL navigation is isolated in its own hook.

React components render models and call services. The workspace hook handles loading, saving, undo and visible errors. The HTTP gateway unlocks editing after the API loads the signed-in account's snapshot. The API initializes each verified account independently and imports legacy records only under that account's user ID. The demo gateway uses fictional data in memory.

Repository contracts separate storage from application behavior. `WorkspaceRepository` coordinates a transaction; task and planning repositories map their own records. Dependencies are passed through constructors rather than looked up inside domain rules. New persistence adapters can implement the same contracts without changing scheduling or shopping logic.

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

## Authentication and access

Supabase Auth verifies the Fitness cookie session or bearer token on the server. The API requires a confirmed, non-anonymous account for workspace access. The verified account ID scopes repository queries. Saves include the loaded workspace ID as a precondition so a change of session cannot redirect a stale edit into a different workspace. The revision separately protects against concurrent edits.

The dashboard reloads on session identity changes. The demo is read-only and uses neither the private state API nor account notifications. Dashboard surfaces, controls and status use the shared UI package.

## Development tooling

Biome formats and lints source files using its recommended preset. Non-null assertions remain allowed for validated task graphs and test fixture lookups; CSS specificity suppressions document the existing responsive/theme cascade. Vitest runs the domain, persistence, rendering, API-access and session tests with the same `@/` alias as the application.
