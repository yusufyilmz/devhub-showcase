# My Fitness Studio app

Next.js app for the fitness workspace, package name `my-fitness-app`. Routes live in `app/`. Task screens live in `features/`. Task rules and repositories live in `lib/`. Shared sign-in is `@shared/auth`. Controls are `@shared/ui`. Push delivery is `@shared/notifications`.

## Run

From the repository root, with Node `>=24.15.0 <25` and pnpm 11:

```sh
pnpm --filter my-fitness-app dev
```

Open [http://localhost:3002](http://localhost:3002). The signed-out demo is [http://localhost:3002/preview](http://localhost:3002/preview). Copy [`.env.example`](.env.example) to `.env.local` and set the Supabase URL, publishable key, and server-only `SUPABASE_DB_URL`. Add `http://localhost:3002/auth/callback` to that project's redirect URLs. Sign in at [http://localhost:3002/login](http://localhost:3002/login).

Appearance uses the same theme controls as MyDevStudio. Each site stores its choice on its own origin.

## Checks

```sh
pnpm --filter my-fitness-app test
pnpm --filter my-fitness-app typecheck
pnpm --filter my-fitness-app build
```

The test suite does not need database credentials. Browser checks and the full gate are in [testing](../../docs/testing.md).

## Read next

| Guide                                              | Read it for                               |
| -------------------------------------------------- | ----------------------------------------- |
| [Fitness guides](../../docs/fitness-app/README.md) | Tasks, agenda, storage, and manual checks |
| [Deployments](../../docs/deployments.md)           | Which pushes ship this app                |
| [Notifications](../../docs/notifications.md)       | Browser push and reminders                |
