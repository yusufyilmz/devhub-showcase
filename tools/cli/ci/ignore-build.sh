#!/bin/sh
# Vercel invokes this from the selected app directory. Zero skips the build;
# nonzero builds it, including missing/shallow comparison history.
set -eu
[ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ] || exit 1
exec git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- \
  . ../../packages ../../tools ../../.github/workflows ../../.github/actions \
  ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml \
  ../../turbo.json ../../biome.json ../../.npmrc ../../.node-version \
  ../../.nvmrc ../../.vercelignore ../../.env.development "../../tsconfig*.json"
