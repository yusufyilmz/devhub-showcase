<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json, the pnpm-workspace.yaml catalog, and declared public exports. Run pnpm generate:catalogs. -->

# @shared/calendar catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "calendar" --package @shared/calendar --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/calendar`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

| Import                            | Source / condition                    | Declared symbols                                                                                                                                               |
| --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/calendar`                | `./src/index.ts`                      | `calendarRange`, `calendarRangeSchema`, `taskDraftSchema`, `type CalendarItem`, `type TaskDraft`                                                               |
| `@shared/calendar/agenda-details` | `./src/components/agenda-details.tsx` | `AgendaDetails`, `type AgendaDetailsProps`                                                                                                                     |
| `@shared/calendar/calendar-grid`  | `./src/components/calendar-grid.tsx`  | `CalendarGrid`, `type CalendarGridProps`                                                                                                                       |
| `@shared/calendar/day-agenda`     | `./src/components/day-agenda.tsx`     | `AgendaItem`, `DayAgenda`, `type DayAgendaProps`                                                                                                               |
| `@shared/calendar/event-row`      | `./src/components/event-row.tsx`      | `EventRow`, `type EventRowProps`                                                                                                                               |
| `@shared/calendar/google`         | `./src/services/google.ts`            | `GoogleAuthorizationError`, `exchangeGoogleCode`, `fetchGoogleItems`, `googleAuthorizationUrl`, `refreshGoogleToken`, `revokeGoogleToken`, `type GoogleConfig` |
| `@shared/calendar/task-form`      | `./src/components/task-form.tsx`      | `ScheduleFields`, `TaskForm`, `type TaskFormProps`                                                                                                             |

Symbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.

| Script         | Command          |
| -------------- | ---------------- |
| `build`        | `tsdown`         |
| `format:check` | `biome format .` |
| `lint`         | `biome lint .`   |
| `typecheck`    | `tsc --noEmit`   |
| `types:check`  | `pnpm typecheck` |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@shared/utils`             | `workspace:*`    | dependencies    |
| `lucide-react`              | `^1.77.0`        | dependencies    |
| `react`                     | `19.3.1`         | dependencies    |
| `zod`                       | `4.6.7`          | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `26.6.6`         | devDependencies |
| `@types/react`              | `19.3.0`         | devDependencies |
| `typescript`                | `7.0.2`          | devDependencies |
