<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json and declared public exports. Run pnpm generate:catalogs. -->

# storybook-app catalog

> **AI lookup guide:** From the repository root, run `pnpm --silent lookup catalog "storybook-app" --package storybook-app --limit 2` to read relevant excerpts. Verify an exact export with `pnpm --silent lookup symbol '<ExportName>' --package storybook-app`. Follow `hasMore` with `--cursor`; use `--max-tokens` to control output size. Excerpts support discovery; read required instructions and source contracts. See the [AI quick start](../../.agents/README.md) and [full CLI usage](../../tools/cli/README.md#token-bounded-repository-lookup).

## Generated package reference

No public package export map or main entry is declared.

| Script            | Command                                                                                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`           | `tsc -b && vite build`                                                                                                                                                                                                                                                 |
| `build-storybook` | `storybook build`                                                                                                                                                                                                                                                      |
| `dev`             | `vite`                                                                                                                                                                                                                                                                 |
| `format`          | `biome format --write .`                                                                                                                                                                                                                                               |
| `format:check`    | `biome format .`                                                                                                                                                                                                                                                       |
| `lint`            | `biome lint .`                                                                                                                                                                                                                                                         |
| `lint:check`      | `biome lint .`                                                                                                                                                                                                                                                         |
| `lint:fix`        | `biome lint --write .`                                                                                                                                                                                                                                                 |
| `preview`         | `vite preview`                                                                                                                                                                                                                                                         |
| `start`           | `storybook dev -p 6006`                                                                                                                                                                                                                                                |
| `storybook`       | `storybook dev -p 6006`                                                                                                                                                                                                                                                |
| `storybook:clean` | `node -e "const fs=require('node:fs'); for (const path of ['node_modules/.cache','node_modules/.vite']) fs.rmSync(path,{recursive:true,force:true})"`                                                                                                                  |
| `storybook:kill`  | `node -e "const {execSync}=require('node:child_process'); let ids=''; try { ids=execSync('lsof -nP -tiTCP:6006 -sTCP:LISTEN',{encoding:'utf8'}).trim(); } catch {} for (const id of ids.split(/\s+/).filter(Boolean)) { try { process.kill(Number(id)); } catch {} }"` |
| `typecheck`       | `tsc -b`                                                                                                                                                                                                                                                               |

| Dependency                   | Declared version | Kind            |
| ---------------------------- | ---------------- | --------------- |
| `@shared/billing`            | `workspace:*`    | dependencies    |
| `@shared/ui`                 | `workspace:*`    | dependencies    |
| `react`                      | `catalog:`       | dependencies    |
| `react-dom`                  | `catalog:`       | dependencies    |
| `tailwindcss`                | `catalog:`       | dependencies    |
| `@chromatic-com/storybook`   | `catalog:`       | devDependencies |
| `@shared/assistant`          | `workspace:*`    | devDependencies |
| `@storybook/addon-a11y`      | `catalog:`       | devDependencies |
| `@storybook/addon-vitest`    | `catalog:`       | devDependencies |
| `@storybook/react-vite`      | `catalog:`       | devDependencies |
| `@tailwindcss/vite`          | `catalog:`       | devDependencies |
| `@types/node`                | `catalog:`       | devDependencies |
| `@types/react`               | `catalog:`       | devDependencies |
| `@types/react-dom`           | `catalog:`       | devDependencies |
| `@vitejs/plugin-react`       | `catalog:`       | devDependencies |
| `@vitest/browser-playwright` | `catalog:`       | devDependencies |
| `storybook`                  | `catalog:`       | devDependencies |
| `typescript`                 | `catalog:`       | devDependencies |
| `vite`                       | `catalog:`       | devDependencies |
