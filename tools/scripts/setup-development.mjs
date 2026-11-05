import { spawnSync } from "node:child_process";
import { lstat, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const target = new URL("../../apps/my-dev-studio/.env.development.local", import.meta.url);
const args = process.argv.slice(2);

async function localSupabaseDefaults() {
  const result = spawnSync("supabase", ["status", "-o", "json", "--workdir", root], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error || result.status !== 0) {
    throw new Error(
      "Local Supabase status unavailable. Install the CLI, start Docker and run supabase start from the repository root, then retry.",
    );
  }
  const status = JSON.parse(result.stdout);
  const endpoint = new URL(status.API_URL);
  if (
    endpoint.protocol !== "http:" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname) ||
    endpoint.username ||
    endpoint.password
  ) {
    throw new Error("Supabase status must return an HTTP loopback API URL.");
  }
  const key = status.PUBLISHABLE_KEY || status.ANON_KEY;
  if (typeof key !== "string" || !key || /[\r\n"\\]/.test(key)) {
    throw new Error("Local Supabase status did not return a valid public key.");
  }
  return { key, url: endpoint.origin };
}

async function setup() {
  if (args.some((argument) => argument !== "--supabase") || args.length > 1) {
    throw new Error("Usage: pnpm dev:setup [--supabase]");
  }
  try {
    await lstat(target);
    console.log("Existing app .env.development.local preserved; no changes made.");
    return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  let defaults = await readFile(new URL("../../.env.development", import.meta.url), "utf8");
  if (args.includes("--supabase")) {
    const local = await localSupabaseDefaults();
    defaults = defaults
      .replace(/^NEXT_PUBLIC_SUPABASE_URL=.*$/m, `NEXT_PUBLIC_SUPABASE_URL=${local.url}`)
      .replace(
        /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*$/m,
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="${local.key}"`,
      );
  }
  await writeFile(target, defaults, { flag: "wx", mode: 0o600 });
  console.log(
    "Created apps/my-dev-studio/.env.development.local. Shell variables take precedence; this file overrides .env.local during development.",
  );
  console.log(
    "For local login, create a confirmed disposable user in local Studio, set LOCAL_TEST_LOGIN=true and its email/password in this ignored file, then run pnpm --filter my-dev-studio dev.",
  );
}

setup().catch((error) => {
  console.error(
    error instanceof SyntaxError ? "Could not parse local Supabase status JSON." : error.message,
  );
  process.exitCode = 1;
});
