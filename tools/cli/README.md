# Shared CLI tooling

Private workspace package `@shared/cli`, alongside `@shared/typescript-config`.

- `scripts/`: repository maintenance and local environment setup. Run root package commands so scripts that use the current directory operate at the repository root.
- `generators/`: Turbo generator definitions and templates. Root generator commands pass this configuration explicitly.
- `tsdown/`: shared library build defaults exported as `@shared/cli/tsdown`.

Run `pnpm dev:setup` or `pnpm dev:setup --supabase` from the repository root. The setup script preserves existing app environment files. See [local development checks](../../docs/testing/manual/local-development.md).
