import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const args = new Set(process.argv.slice(2));
const allowed = new Set(["--skip-install", "--skip-supabase", "--with-e2e"]);
for (const argument of args) {
  if (!allowed.has(argument)) {
    console.error("Usage: pnpm setup [--skip-install] [--skip-supabase] [--with-e2e]");
    process.exit(1);
  }
}

function run(command, arguments_, { optional = false } = {}) {
  const label = [command, ...arguments_].join(" ");
  console.log(`→ ${label}`);
  const result = spawnSync(command, arguments_, {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    if (optional) return false;
    process.exit(result.status ?? 1);
  }
  return true;
}

function supabaseReady() {
  const result = spawnSync("supabase", ["status", "--workdir", root], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "ignore", "pipe"],
  });
  return result.status === 0;
}

if (!args.has("--skip-install")) {
  run("pnpm", ["install", "--frozen-lockfile"]);
}

run("pnpm", ["generate:catalogs"]);

if (!args.has("--skip-supabase")) {
  if (!supabaseReady()) {
    console.log("Local Supabase is not running; starting the stack.");
    run("supabase", ["start", "--workdir", root]);
  }
  run("pnpm", ["supabase:migrate"]);
  run("node", ["tools/cli/scripts/setup-development.mjs", "--supabase"]);
} else {
  run("node", ["tools/cli/scripts/setup-development.mjs"], { optional: true });
}

if (args.has("--with-e2e")) {
  run("pnpm", ["setup:e2e"]);
}

console.log("Setup complete. Run pnpm dev --hostname 127.0.0.1 --port 3100 when Supabase is up.");
