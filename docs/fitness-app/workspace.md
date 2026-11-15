# Fitness workspace

## When to read

Read this for how My Fitness Studio behaves: the task tree, the agenda and calendar, weekly cooking and shopping, account access, and the v1 import. Storage and service boundaries are in [architecture](architecture.md). Click-by-click checks stay in the [manual guides](README.md#manual-checks).

## Task hierarchy

Everything actionable is a task. Templates, scheduled daily snapshots, and generated weekly tasks share one model, with `parentId` for nesting and `sourceTaskId` for history.

- Gym leads to a workout day, then a superset or exercise, then individual sets.
- Diet leads to a meal plan, then meals with structured ingredient rows.
- Routines hold supplement and water tasks.
- The weekly plan holds cooking tasks and a grocery checklist.

Exercise instructions, set sequences, meal alternatives, and supplement doses are preserved. Water starts at 250 ml per glass and stays editable. Missing quantities and macros are not invented.

Tasks can add subtasks, edit instructions and ingredient quantities, reorder siblings, and archive templates. Archiving removes a template from future use and keeps existing daily logs. Diet rotation, weekday schedules, and date-specific overrides determine each day's plan. A logged day cannot be replaced wholesale. Set completion requires actual reps and weight, and previous completed values stay visible.

## Calendar and hourly agenda

Today and a selected date share one chronological agenda. Activities are grouped by hour. Items without a time appear at the end. Each row has a completion checkbox and a details link. Workout sets stay inside the workout details. Details and date pages use URL query links and browser history.

Calendar has a month view with event cards and a week view with hourly columns. Selecting a date opens its agenda. Selecting an event opens its details. On desktop, dragging a pending scheduled activity onto another date moves that occurrence. In week view, dropping into an hour sets the start time to that hour. A month drop keeps the existing time. The details page has exact date and time fields for touch and keyboard use. Events show a start time only. Simultaneous items stack within the hour.

A move affects only the selected occurrence and its subtasks. It keeps ingredient snapshots and per-occurrence meal choices, and marks weekly meal and shopping output stale when that output depends on the move. Completed or skipped activities must be reopened first. A date with a moved template occurrence cannot have its whole day plan replaced. Generated cooking and shopping tasks follow the saved weekly plan. Move the original meal and regenerate the week to update them. The read-only preview allows navigation and disables dragging and edits.

## Weekly cooking and shopping

The Week screen expands seven diet days from the configured rotation and calendar overrides. Cooking tasks show the planned meals. Shopping combines their structured ingredients.

Each meal's diet alternatives stay as choices until the owner selects one. Optional ingredients are excluded by default. Quantity ranges remain ranges, unspecified quantities remain unspecified, and different units stay separate. The app does not guess raw-to-cooked weights or convert cups to grams.

Saving the week creates persistent cooking and shopping tasks. Regeneration keeps completion only for unchanged items. Changed items return to pending. Meal-planning changes mark a saved weekly plan stale. Skipped meals are left out of the generated cooking and shopping lists.

## Access

`GET /api/state` returns the signed-in account's snapshot, revision, and `workspaceId`. `PUT /api/state` must send that `workspaceId` and revision. Signed-out and unconfirmed requests receive HTTP 401. A changed account or stale revision receives HTTP 409. Responses are private and uncached. The demo at `/preview` does not call this API.

## Upgrading an existing account

Keep `SUPABASE_DB_URL` and the public Supabase keys on the existing Fitness project. Each account continues to own its rows.

If `fitness_workspaces` contains that user's validated v1 JSON, the first authenticated load converts it into the relational task model. Existing meal completion, set logs, water logs, and weight entries are retained. The old table is left in place. A failed import does not fall back to an empty workspace.

## App layout

Paths are relative to `apps/my-fitness-app`.

| Path                      | Responsibility                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `features/fitness`        | App shell, login, and composition of the gateway and workspace UI                       |
| `features/task-workspace` | Navigation, calendar, settings, persistence coordination, and reminders                 |
| `features/task-tree`      | Recursive task presentation and completion controls                                     |
| `features/task-editor`    | Task and structured ingredient forms                                                    |
| `features/weekly-planner` | Weekly cooking and shopping workflow                                                    |
| `features/agenda`         | Day agenda, event rows, and date navigation                                             |
| `lib/domain`              | Typed models, schema validation, dates, and seed composition                            |
| `lib/services`            | Task operations, scheduling, meal planning, shopping aggregation, and weekly generation |
| `lib/repositories`        | Persistence contracts and Drizzle implementations                                       |
| `lib/db`                  | ORM models. The SQL is `supabase/migrations/20261101120000_fitness_task_workspaces.sql` |
| `lib/migrations`          | Version-one conversion and original trainer source data                                 |
| `tests`                   | Domain, migration, persistence, and read-only rendering tests                           |

Domain rules do not import React, Drizzle, or Supabase. Storage is reached through repository interfaces. The UI uses an HTTP gateway that stays read-only until the server confirms the owner. Persistence boundaries are in [architecture](architecture.md).

## Extra hostname

[myfitnessstudio.vercel.app](https://myfitnessstudio.vercel.app/) can be attached to the existing Fitness Vercel project. Production deployment itself is described in [deployments](../deployments.md).

1. Add `https://myfitnessstudio.vercel.app/auth/callback` to the Fitness Supabase project's redirect URLs. Keep the existing callback. Both hosts use the same Supabase project and Google provider.
2. Set the Vercel production variable `FITNESS_ADDITIONAL_ORIGIN=https://myfitnessstudio.vercel.app`. Keep the current `APP_URL` for existing bookmarks and writes.
3. Confirm the signed-out state endpoint still returns HTTP 401.
4. Add `myfitnessstudio.vercel.app` as a production domain. Check HTTPS, login, and saving on both domains with the [workspaces guide](../testing/manual/fitness-workspaces.md).

Each hostname has its own browser session. The same Fitness account opens the same records on both.
