# My Fitness Studio

My Fitness Studio uses Next.js, Supabase Auth and Drizzle. Each confirmed account gets its own private workspace, stored under its Supabase user ID.

## Run

Use the Node.js and pnpm versions pinned in the repository root `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm --filter my-fitness-app dev
```

Open [My Fitness Studio](http://localhost:3002/) (`/`) after configuring Supabase. Use [Demo](http://localhost:3002/preview) (`/preview`) to explore fictional activities without an account or database connection.

## Light and dark themes

Use the theme control in the top bar or on the login page. Fitness uses the same `PageShell`, `ThemeProvider`, and `ThemeToggle` as MyDevStudio platform routes, with storage key `mydevstudio-theme` and the shared `mydevstudio-userconfig-store` record (`activeMode`: `light`, `dark`, or `system`). On the same site origin, one choice applies to both apps; local dev on different ports (`3001` / `3002`) keeps separate storage until both run on one host.

Shared styling loads `@shared/ui/styles.css`. Dashboard layout and components live in `app/globals.css`.

## Supabase setup

1. Copy `.env.example` to `.env.local`. Set the Fitness project's Supabase URL, publishable key and server-only `SUPABASE_DB_URL` pooler URI.
2. Apply the existing workspace migration, `supabase/migrations/20261101120000_fitness_task_workspaces.sql`, if setting up a fresh database.
3. Add the exact Fitness callback URL in Supabase Auth. For local development use [Auth callback](http://localhost:3002/auth/callback) (`/auth/callback`).
4. Configure Google OAuth and allow signup in the Fitness Supabase project for self-service Google accounts. For email/password, provision or invite confirmed users through that project.
5. Open [Sign in](http://localhost:3002/login) (`/login`). The first workspace load imports the account's legacy data if present, or starts with an empty routine and one editable meal-plan template.

## Private workspaces

The API uses the verified cookie session or bearer token to select the account on each request. Signed-out and unconfirmed requests receive HTTP 401. `GET /api/state` returns the account's snapshot, revision and `workspaceId`. Send that `workspaceId` and revision with `PUT /api/state`. A changed account or stale revision returns HTTP 409. The server selects the row from the verified session. Responses are private and uncached, and database row policies isolate accounts for direct authenticated access.

Open [Demo](http://localhost:3002/preview) (`/preview`) to share a sample day. Sign out under More to clear the Fitness session on that browser. Auth cookies apply to the configured Fitness project and site hostname.

## Deploy

Create a separate Vercel project for this app. Set its root directory to `apps/my-fitness-app`. `vercel.json` installs and builds from the monorepo root with the committed lockfile. Add all variables from `.env.example`, setting `APP_URL` to the exact deployed origin. Apply the migrations before using the authenticated app and configure that origin in Supabase Auth's URL settings. Redeploy after changing environment variables.

On `main`, `.github/workflows/ci.yml` deploys this app after verification when Fitness or shared code changes. The `VERCEL_FITNESS_PROJECT_ID` repository variable selects the existing `yusuf-fitness-os` Vercel project using the monorepo’s deployment credentials. The old private repository’s deployment workflow is retired. See [deployment setup and cutover](../../docs/deployments.md); point the Vercel project root at `apps/my-fitness-app`.

Verify `/preview` signed out, `/login`, and saving then refreshing a task when signed in. No live Supabase or hosting credentials are included in the repository.

## Checks

From the repository root, `pnpm check` covers this app, `pnpm test` runs its Vitest suite after the studio unit project, and `pnpm build` runs `next build` for this package. App-only commands:

```sh
pnpm --filter my-fitness-app test
pnpm --filter my-fitness-app typecheck
pnpm --filter my-fitness-app build
```

No database credentials or migrations are needed for the test suite. Apply pending Supabase migrations separately before releasing changes that require them.

## Task hierarchy

Everything actionable is a task. Templates, scheduled daily snapshots and generated weekly tasks share one model, with `parentId` for nesting and `sourceTaskId` for history.

- Gym → workout day → superset or exercise → individual sets.
- Diet → Yusuf plan → meals with structured ingredient rows.
- Routines → supplement and water tasks.
- Weekly plan → cooking → meals to cook, and shopping → grocery checklist items.

The original two diet plans and all four workout days are converted into these trees. The exercise instructions, set sequences, meal alternatives and supplement doses are preserved. Water initially assumes 250 ml per glass and is editable. Missing quantities and macros are not invented.

Use Tasks to add tasks/subtasks, edit instructions and ingredient quantities, reorder siblings, and archive templates. Archiving removes templates from future use while preserving existing daily logs. Diet rotation, weekday schedules and date-specific overrides determine each day's plan. A logged day cannot be replaced wholesale. Set completion requires actual reps and weight, and previous completed values are shown.

## Calendar and hourly agenda

Today and selected dates share one chronological agenda. Activities are grouped by hour; items without a time are shown at the end. Each row has a completion checkbox and a details link. Workout sets stay inside the workout details rather than flooding the calendar. Details and date pages have URL query links and support browser history.

Calendar offers a month view with event cards and a week view with hourly columns. Select a date to open its agenda or an event to open its details. On desktop, drag a pending scheduled activity onto another date; in week view, dropping into an hour sets the start time to that hour. A month drop preserves its existing time. The details page provides exact date/time fields for touch and keyboard use. No event duration is invented: events display their start time, and simultaneous items stack within the hour.

Moves affect only the selected occurrence and its subtasks. They preserve ingredient snapshots and per-occurrence meal choices, and mark weekly meal/shopping output stale when relevant. Completed or skipped activities must be reopened first. Full day-plan replacement is blocked for dates with moved template occurrences, protecting their history. Generated cooking/shopping tasks follow the saved weekly plan; move the original meal and regenerate the week to update them. Read-only preview supports navigation but disables dragging and changes.

## Weekly cooking and shopping

Choose a week on the Week screen. The planner expands its seven diet days using the configured rotation and calendar overrides. Cooking tasks show the planned meals; shopping combines their structured ingredients.

Choose among diet alternatives for each meal before finalizing the list. Unresolved alternatives are shown as choices, not silently selected or all added together. Optional ingredients are excluded by default. Quantity ranges remain ranges, unspecified quantities remain unspecified, and different units remain separate. The app does not guess raw-to-cooked weights or convert cups to grams.

Save the week to create persistent cooking and shopping tasks. Regeneration retains completion only for unchanged items; changed items return to pending. Changes to meal planning mark saved weekly plans stale so you can regenerate. Skipped meals are excluded from the generated cooking and shopping lists.

## Structure and responsibilities

| Path                      | Responsibility                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `app/fitness-app.tsx`     | Thin entry point composing the gateway and workspace UI                                 |
| `features/task-workspace` | Navigation, calendar, settings, persistence coordination and reminders                  |
| `features/task-tree`      | Recursive task presentation and completion controls                                     |
| `features/task-editor`    | Task and structured ingredient forms                                                    |
| `features/weekly-planner` | Weekly cooking/shopping workflow                                                        |
| `lib/domain`              | Typed models, schema validation, dates and seed composition                             |
| `lib/services`            | Task operations, scheduling, meal planning, shopping aggregation and weekly generation  |
| `lib/repositories`        | Persistence contracts and Drizzle implementations                                       |
| `lib/db`                  | ORM models. The SQL is `supabase/migrations/20261101120000_fitness_task_workspaces.sql` |
| `lib/migrations`          | Version-one conversion and original trainer source data                                 |
| `tests`                   | Domain, migration, persistence and read-only rendering tests                            |

Services have separate responsibilities. Domain rules do not import React, Drizzle or Supabase. Storage is accessed through repository interfaces, and the UI uses an HTTP gateway that stays read-only until the server confirms owner permissions. See `ARCHITECTURE.md` for persistence boundaries and tradeoffs.

## Upgrading

Keep `SUPABASE_DB_URL` and the public Supabase keys on the existing Fitness project. Each account continues to own its existing rows. The single-owner environment setting can be removed after this release.

If `fitness_workspaces` contains that user's validated v1 JSON, the first authenticated load converts it into the relational task model. Existing meal completion, actual set logs, water logs and weight entries are retained. The old table is left untouched. A failed import does not fall back to an empty workspace.

## Validation and limits

```sh
pnpm format        # Biome formatter, writes files
pnpm format:check  # Check formatting
pnpm lint:check    # Biome recommended lint rules (`pnpm lint` is an alias)
pnpm lint:fix      # Apply safe lint fixes
pnpm check         # Formatting, lint and import checks together
pnpm test          # Vitest, one run
pnpm test:watch    # Vitest watch mode
pnpm typecheck
pnpm build
```

Prettier and the Node test runner have been replaced by Biome and Vitest. Biome configuration is in `biome.json`, and Vitest configuration is in `vitest.config.mts`. Generated SQL snapshots and the pnpm lockfile are excluded from formatting.

Tests cover anonymous denial, cross-account isolation, token verification, remembered sessions, trainer conversion, rotation, overrides, historical snapshots, leaf-based progress, alternatives/ranges, deterministic regeneration, revision conflicts, and read-only rendering. Embedded PostgreSQL tests execute the real SQL migrations and ORM roundtrips, rollback, RLS and owner deletion. Live Supabase authentication, your pooler configuration and interactive browser/mobile behavior still need checks in your deployment.

Open-app reminders work with browser permission. Optional background Web Push, authenticated WebSocket updates and PWA installation use the shared `@shared/notifications` package; follow [notification setup](../../docs/notifications.md). Background reminders require the notification migration, VAPID credentials and a minute scheduler. Offline mode serves a public fallback; there is no offline write queue. The demo uses fictional records. The API saves one account’s validated workspace in one transaction.
