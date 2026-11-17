<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json and declared public exports. Run pnpm generate:catalogs. -->

# @shared/calendar catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "calendar" --package @shared/calendar --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package @shared/calendar`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

| Import                           | Source / condition        | Declared symbols                                                                                                                                               |
| -------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@shared/calendar`               | `./src/model.ts`          | `calendarRange`, `calendarRangeSchema`, `taskDraftSchema`, `type CalendarItem`, `type TaskDraft`                                                               |
| `@shared/calendar/calendar-grid` | `./src/calendar-grid.tsx` | `CalendarGrid`, `type CalendarGridProps`                                                                                                                       |
| `@shared/calendar/day-agenda`    | `./src/day-agenda.tsx`    | `AgendaItem`, `DayAgenda`, `type DayAgendaProps`                                                                                                               |
| `@shared/calendar/google`        | `./src/google.ts`         | `GoogleAuthorizationError`, `exchangeGoogleCode`, `fetchGoogleItems`, `googleAuthorizationUrl`, `refreshGoogleToken`, `revokeGoogleToken`, `type GoogleConfig` |
| `@shared/calendar/task-form`     | `./src/task-form.tsx`     | `ScheduleFields`, `TaskForm`, `type TaskFormProps`                                                                                                             |

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
| `lucide-react`              | `catalog:`       | dependencies    |
| `react`                     | `catalog:`       | dependencies    |
| `zod`                       | `catalog:`       | dependencies    |
| `@shared/cli`               | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
