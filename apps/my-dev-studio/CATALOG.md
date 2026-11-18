<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json, the pnpm-workspace.yaml catalog, and declared public exports. Run pnpm generate:catalogs. -->

# my-dev-studio catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "my-dev-studio" --package my-dev-studio --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package my-dev-studio`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

No public package export map or main entry is declared.

| Script         | Command                                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | `next build --webpack`                                                                                                                                                                                                                                                 |
| `clean`        | `node -e "require('node:fs').rmSync('.next',{recursive:true,force:true})"`                                                                                                                                                                                             |
| `demo:seed`    | `node --env-file-if-exists=.env.local scripts/seed-demo.mjs`                                                                                                                                                                                                           |
| `dev`          | `next dev --webpack --port=3001`                                                                                                                                                                                                                                       |
| `format`       | `biome format --write .`                                                                                                                                                                                                                                               |
| `format:check` | `biome format .`                                                                                                                                                                                                                                                       |
| `kill`         | `node -e "const {execSync}=require('node:child_process'); let ids=''; try { ids=execSync('lsof -nP -tiTCP:3001 -sTCP:LISTEN',{encoding:'utf8'}).trim(); } catch {} for (const id of ids.split(/\s+/).filter(Boolean)) { try { process.kill(Number(id)); } catch {} }"` |
| `lint`         | `biome lint .`                                                                                                                                                                                                                                                         |
| `lint:check`   | `biome lint .`                                                                                                                                                                                                                                                         |
| `lint:fix`     | `biome lint --write .`                                                                                                                                                                                                                                                 |
| `start`        | `next start --port=3001`                                                                                                                                                                                                                                               |
| `test`         | `vitest run`                                                                                                                                                                                                                                                           |
| `test:e2e`     | `playwright test`                                                                                                                                                                                                                                                      |
| `typecheck`    | `tsc --noEmit`                                                                                                                                                                                                                                                         |
| `types:check`  | `pnpm typecheck`                                                                                                                                                                                                                                                       |

| Dependency                  | Declared version | Kind            |
| --------------------------- | ---------------- | --------------- |
| `@shared/assistant`         | `workspace:*`    | dependencies    |
| `@shared/auth`              | `workspace:*`    | dependencies    |
| `@shared/billing`           | `workspace:*`    | dependencies    |
| `@shared/calendar`          | `workspace:*`    | dependencies    |
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/env`               | `workspace:*`    | dependencies    |
| `@shared/lib`               | `workspace:*`    | dependencies    |
| `@shared/notifications`     | `workspace:*`    | dependencies    |
| `@shared/runtime`           | `workspace:*`    | dependencies    |
| `@shared/trello`            | `workspace:*`    | dependencies    |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@shared/utils`             | `workspace:*`    | dependencies    |
| `@supabase/supabase-js`     | `2.119.0`        | dependencies    |
| `next`                      | `16.4.5`         | dependencies    |
| `react`                     | `19.3.1`         | dependencies    |
| `react-dom`                 | `19.3.1`         | dependencies    |
| `zod`                       | `4.6.7`          | dependencies    |
| `@shared/test`              | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@shared/ui`                | `workspace:*`    | devDependencies |
| `@tailwindcss/postcss`      | `4.3.5`          | devDependencies |
| `@types/node`               | `26.6.6`         | devDependencies |
| `@types/react`              | `19.3.0`         | devDependencies |
| `@types/react-dom`          | `19.3.0`         | devDependencies |
| `postcss`                   | `8.5.32`         | devDependencies |
| `tailwindcss`               | `4.3.5`          | devDependencies |
| `typescript`                | `7.0.2`          | devDependencies |
