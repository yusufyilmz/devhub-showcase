# Services catalog

Domain services and repositories for `@shared/services`. Public imports use at most **two** path segments (see AGENTS.md).

## Studio

| Export                                | Path                                       | Use                                 |
| ------------------------------------- | ------------------------------------------ | ----------------------------------- |
| `@shared/services/studio`             | `src/studio/index.ts`                      | Portfolio resource services barrel  |
| `@shared/services/profile`            | `src/profile/index.ts`                     | Profile repository and services     |
| `@shared/services/portfolio`          | `src/portfolio/index.ts`                   | Published portfolio resources       |
| `@shared/services/profile-service`    | `src/profile/service/profile-service.ts`   | Owner profile saves                 |
| `@shared/services/profile-repository` | `src/profile/repository/supabase.ts`       | Supabase profile persistence        |
| `@shared/services/profile`            | `src/profile/repository/index.ts`          | Profile repository types and errors |
| `@shared/services/published-profile`  | `src/profile/service/published-profile.ts` | Public profile reads                |
| `@shared/services/user-profile`       | `src/profile/service/user-profile.ts`      | User profile bootstrap              |

Supabase clients and schema: `@shared/auth/*`, `@shared/lib/supabase`, `@shared/lib/types`.

## Fitness

| Export                               | Path                             | Use                                      |
| ------------------------------------ | -------------------------------- | ---------------------------------------- |
| `@shared/services/db/*`              | `src/fitness/db/*`               | Drizzle client, schema, seed, migrations |
| `@shared/services/fitness`           | `src/fitness/index.ts`           | Fitness barrel                           |
| `@shared/services/fitness/types`     | `src/fitness/types/index.ts`     | Task, workspace, nutrition models        |
| `@shared/services/fitness/workspace` | `src/fitness/workspace/index.ts` | Repository + workspace services          |
| `@shared/services/fitness/task`      | `src/fitness/task/index.ts`      | Task service                             |
| `@shared/services/fitness/schedule`  | `src/fitness/schedule/index.ts`  | Schedule and agenda                      |
| `@shared/services/fitness/meal`      | `src/fitness/meal/index.ts`      | Meal planning                            |
