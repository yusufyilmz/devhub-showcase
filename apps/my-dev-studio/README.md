# MyDevStudio app

Next.js app for the portfolio studio, package name `my-dev-studio`. Routes, metadata, and app-only bindings live in `app/`. Shared persistence is `@shared/lib`. Studio, portfolio, and chat compositions are `@shared/assistant`. Controls are `@shared/ui`. There is no `apps/web` package and no `lib` folder in this app.

## Run

From the repository root, with Node `>=24.15.0 <25` and pnpm 11:

```sh
pnpm --filter my-dev-studio dev
```

Open [http://localhost:3001](http://localhost:3001). Copy [`.env.example`](.env.example) into `.env.local` for credentials. Setup details, shared commands, and deployment are in the [repository README](../../README.md).

## Read next

| Guide                                            | Read it for                                 |
| ------------------------------------------------ | ------------------------------------------- |
| [Studio guides](../../docs/dev-studio/README.md) | Accounts, sections, billing, and assistants |
| [Architecture](../../docs/architecture.md)       | Package boundaries                          |
| [Testing](../../docs/testing.md)                 | Unit tests, browser tests, and CI           |
