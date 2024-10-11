#!/bin/bash

SELF="${BASH_SOURCE[0]}"
BIN_DIR="$(cd "$(dirname "$SELF")" && pwd)"
APP_DIR="$(dirname "$BIN_DIR")"

cd "$APP_DIR" || exit $?
set -E

SEEDS_DIR="prisma/seeds"

for file in $SEEDS_DIR/*.sql; do
  echo "Executing SQL from file: ${file}"
  npx -y prisma db execute --schema prisma/schema.prisma --file ${file}
done

echo "Finished executing SQL files."
