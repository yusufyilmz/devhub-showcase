<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# my-dev-studio catalog

Workspace package `my-dev-studio`.

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
| `@shared/config`            | `workspace:*`    | dependencies    |
| `@shared/lib`               | `workspace:*`    | dependencies    |
| `@shared/runtime`           | `workspace:*`    | dependencies    |
| `@shared/ui`                | `workspace:*`    | dependencies    |
| `@shared/utils`             | `workspace:*`    | dependencies    |
| `@supabase/supabase-js`     | `catalog:`       | dependencies    |
| `@t3-oss/env-nextjs`        | `catalog:`       | dependencies    |
| `next`                      | `catalog:`       | dependencies    |
| `react`                     | `catalog:`       | dependencies    |
| `react-dom`                 | `catalog:`       | dependencies    |
| `zod`                       | `catalog:`       | dependencies    |
| `@shared/test`              | `workspace:*`    | devDependencies |
| `@shared/typescript-config` | `workspace:*`    | devDependencies |
| `@shared/ui`                | `workspace:*`    | devDependencies |
| `@tailwindcss/postcss`      | `catalog:`       | devDependencies |
| `@types/node`               | `catalog:`       | devDependencies |
| `@types/react`              | `catalog:`       | devDependencies |
| `@types/react-dom`          | `catalog:`       | devDependencies |
| `postcss`                   | `catalog:`       | devDependencies |
| `tailwindcss`               | `catalog:`       | devDependencies |
| `typescript`                | `catalog:`       | devDependencies |
