# Biome helpers

## Package self-import rule

Each workspace package under `packages/*` has a nested `biome.json` that extends the repo root (`"extends": "//"`) and configures `style/noRestrictedImports` so source files cannot import the package’s own published alias (for example `@shared/ui/**` inside `packages/ui`).

When you add a package, copy `no-self-import.template.json` into the new package as `biome.json`, set `"extends": "//"`, and replace the `group` entries with that package’s npm name and any root `tsconfig` aliases that point into the same tree (for example `@shared/ui/login` for `@shared/auth`).

Use relative imports within the package. Consumers outside the package should keep using `@shared/*` exports.
