<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json, the pnpm-workspace.yaml catalog, and declared public exports. Run pnpm generate:catalogs. -->

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
| `react`                      | `19.3.1`         | dependencies    |
| `react-dom`                  | `19.3.1`         | dependencies    |
| `tailwindcss`                | `4.3.5`          | dependencies    |
| `@chromatic-com/storybook`   | `^5.6.0`         | devDependencies |
| `@shared/assistant`          | `workspace:*`    | devDependencies |
| `@storybook/addon-a11y`      | `^10.6.7`        | devDependencies |
| `@storybook/addon-vitest`    | `^10.6.7`        | devDependencies |
| `@storybook/react-vite`      | `^10.6.7`        | devDependencies |
| `@tailwindcss/vite`          | `4.3.5`          | devDependencies |
| `@types/node`                | `26.6.6`         | devDependencies |
| `@types/react`               | `19.3.0`         | devDependencies |
| `@types/react-dom`           | `19.3.0`         | devDependencies |
| `@vitejs/plugin-react`       | `^6.3.0`         | devDependencies |
| `@vitest/browser-playwright` | `5.1.0`          | devDependencies |
| `storybook`                  | `^10.6.7`        | devDependencies |
| `typescript`                 | `7.0.2`          | devDependencies |
| `vite`                       | `^8.3.8`         | devDependencies |
