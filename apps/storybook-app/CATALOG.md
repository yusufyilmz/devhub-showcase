<!-- Generated from catalog.template.md, package.json and declared public exports. Run pnpm generate:catalogs. -->

# storybook-app catalog

Workspace package `storybook-app`.

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
| `storybook`       | `storybook dev -p 6006`                                                                                                                                                                                                                                                |
| `storybook:clean` | `node -e "const fs=require('node:fs'); for (const path of ['node_modules/.cache','node_modules/.vite']) fs.rmSync(path,{recursive:true,force:true})"`                                                                                                                  |
| `storybook:kill`  | `node -e "const {execSync}=require('node:child_process'); let ids=''; try { ids=execSync('lsof -nP -tiTCP:6006 -sTCP:LISTEN',{encoding:'utf8'}).trim(); } catch {} for (const id of ids.split(/\s+/).filter(Boolean)) { try { process.kill(Number(id)); } catch {} }"` |
| `typecheck`       | `tsc -b`                                                                                                                                                                                                                                                               |

| Dependency                   | Declared version | Kind            |
| ---------------------------- | ---------------- | --------------- |
| `@shared/billing`            | `workspace:*`    | dependencies    |
| `@shared/ui`                 | `workspace:*`    | dependencies    |
| `@tailwindcss/postcss`       | `catalog:`       | dependencies    |
| `postcss`                    | `catalog:`       | dependencies    |
| `react`                      | `catalog:`       | dependencies    |
| `react-dom`                  | `catalog:`       | dependencies    |
| `tailwindcss`                | `catalog:`       | dependencies    |
| `@chromatic-com/storybook`   | `catalog:`       | devDependencies |
| `@shared/assistant`          | `workspace:*`    | devDependencies |
| `@storybook/addon-a11y`      | `catalog:`       | devDependencies |
| `@storybook/addon-vitest`    | `catalog:`       | devDependencies |
| `@storybook/react-vite`      | `catalog:`       | devDependencies |
| `@types/node`                | `catalog:`       | devDependencies |
| `@types/react`               | `catalog:`       | devDependencies |
| `@types/react-dom`           | `catalog:`       | devDependencies |
| `@vitejs/plugin-react`       | `catalog:`       | devDependencies |
| `@vitest/browser-playwright` | `catalog:`       | devDependencies |
| `storybook`                  | `catalog:`       | devDependencies |
| `typescript`                 | `catalog:`       | devDependencies |
| `vite`                       | `catalog:`       | devDependencies |
