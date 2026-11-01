# Yusuf Fitness OS — task-based edition

Next.js app in this monorepo (`apps/my-fitness-app`). It uses TypeScript, pnpm, Supabase Auth, and Drizzle ORM against the shared Supabase project in `supabase/migrations`. Fitness rows use the same `auth.users` id as a portfolio owner. The app still has its own routes and is not part of the MyDevStudio production deploy.

## Run

Use the Node.js and pnpm versions pinned in the repository root `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm --filter my-fitness-app dev
```

Open `http://localhost:3002` after completing Supabase setup below. The dev server uses port 3002 so it can run beside MyDevStudio on port 3000. The same URL shows your live workspace read-only to visitors and unlocks editing when you sign in as its owner. `/preview` always displays that same live data in read-only mode, even if you are signed in. It is no longer a bundled sample and requires your configured Supabase project.

## Light and dark themes

Use the theme control in the top bar or on the login page. Fitness uses the same `PageShell`, `ThemeProvider`, and `ThemeToggle` as MyDevStudio platform routes, with storage key `mydevstudio-theme` and the shared `mydevstudio-userconfig-store` record (`activeMode`: `light`, `dark`, or `system`). On the same site origin, one choice applies to both apps; local dev on different ports (`3001` / `3002`) keeps separate storage until both run on one host.

Shared styling loads `@shared/ui/styles.css`. Dashboard layout and components live in `app/globals.css`.

## Supabase setup

1. Use the same Supabase project as MyDevStudio. Copy `.env.example` to `.env.local`.
2. Set the Supabase URL and publishable key from that project. Set `SUPABASE_DB_URL` to the same project's pooler connection URI, including its database password. Keep this server-only value private; never prefix it with `NEXT_PUBLIC_`.
3. Apply `supabase/migrations/20261101120000_fitness_task_workspaces.sql` with the rest of the shared migration history. It creates the fitness tables and ties `user_id` to `auth.users`. Do not run a second migrator from this app.
4. Copy the owner's UUID from Authentication → Users into `WORKSPACE_OWNER_ID` in `.env.local`. That id must already exist in this project's Auth users. Only this user can edit.
5. Add this app's `/auth/callback` URL to the same Supabase project's Authentication → URL Configuration → Redirect URLs. Locally that is `http://localhost:3002/auth/callback`. Keep the MyDevStudio callback in that list too.
6. Restart the app and sign in at `/login` with Google or email. The first owner load creates or imports your task workspace. Until this first login, visitors see an initialization message. Share the main website URL after that; visitors need no login.

The app verifies bearer tokens with Supabase Auth and compares the verified user ID with `WORKSPACE_OWNER_ID` before every write. Anonymous visitors and other authenticated accounts can only read the configured owner’s workspace. The server ORM uses your pooler credentials, which can bypass RLS; every repository query therefore explicitly scopes data to the configured owner. Anonymous database grants remain revoked: public reads go through the controlled application API. Never expose the database URI to browsers or commit `.env.local`.

## Sharing and remembered login

Anyone with the site URL can view the current task plans, calendar, completion records, shopping lists, and weight history. Visitors cannot change tasks, log sets, drag events, or modify settings. The read-only view refreshes every 30 seconds while visible and when the tab receives focus. The API is uncached and rejects writes unless Supabase verifies the configured owner; UI controls are not the authorization boundary.

Sign-in uses the same Google and email handlers as MyDevStudio. Supabase stores the session in a host cookie (`path=/`, shared by every port on that host), so signing in on MyDevStudio opens this app already signed in, and the reverse is true. Your password is sent only for sign-in and is never saved. The browser’s password manager can fill it using the standard password field. Sign out under More clears that shared cookie on this browser, including the studio session. Other open tabs switch back to read-only after sign-out. A signed-in account that is not `WORKSPACE_OWNER_ID` can view the workspace and cannot edit it. Theme preference stays in the shared user-config record, separate from the session.

The previously used SSR cookies are no longer used for access control. Existing users need to sign in once after this update. This is one shared personal workspace, not a platform where any registered account gets editing rights.

## Deploy

Create a separate Vercel project for this app. Set its root directory to `apps/my-fitness-app`. `vercel.json` installs and builds from the monorepo root with the committed lockfile. Add all variables from `.env.example`, setting `APP_URL` to the exact deployed origin. Apply the migrations before using the authenticated app and configure that origin in Supabase Auth's URL settings. Redeploy after changing environment variables.

On `main`, `.github/workflows/ci.yml` deploys this app after verification using `VERCEL_FITNESS_PROJECT_ID` (same org and token as MyDevStudio). Point the Vercel project root at `apps/my-fitness-app`.

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

Point `SUPABASE_DB_URL` and the public Supabase keys at the shared project, and set `WORKSPACE_OWNER_ID` to that project's Auth user id. Apply the shared migration before the first owner login. This change does not copy rows from a previous Fitness OS project.

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

Tests cover public read-only access, owner-only writes, token verification, remembered sessions, trainer conversion, rotation, overrides, historical snapshots, leaf-based progress, alternatives/ranges, deterministic regeneration, revision conflicts, and read-only rendering. Embedded PostgreSQL tests execute the real SQL migrations and ORM roundtrips, rollback, RLS and owner deletion. Live Supabase authentication, your pooler configuration and interactive browser/mobile behavior still need checks in your deployment.

Reminders require the page to remain open. There is no background push or offline write queue. The shared view intentionally publishes your saved workspace data; it does not publish credentials or session tokens. The personal-app API saves a validated workspace in one transaction; it is not designed for large multi-user workspaces or collaborative editing.
