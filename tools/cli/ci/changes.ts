import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Application = "studio" | "fitness";
const sharedFiles = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "turbo.json",
  "biome.json",
  ".npmrc",
  ".node-version",
  ".nvmrc",
  ".vercelignore",
  ".env.development",
]);
export function classifyChanges(paths: readonly string[]) {
  let studio = false;
  let fitness = false;
  for (const path of paths) {
    const shared =
      path.startsWith("packages/") ||
      path.startsWith("tools/") ||
      path.startsWith(".github/workflows/") ||
      path.startsWith(".github/actions/") ||
      sharedFiles.has(path) ||
      /^tsconfig[^/]*\.json$/.test(path);
    studio ||= shared || path.startsWith("apps/my-dev-studio/");
    fitness ||= shared || path.startsWith("apps/my-fitness-app/");
  }
  return { fitness, studio };
}
function git(cwd: string, args: string[]) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
export function changedPaths(cwd: string, base: string, head: string, pullRequest = false) {
  if (![base, head].every((value) => /^[a-f\d]{40,64}$/i.test(value)))
    throw new Error("Expected commit IDs.");
  return git(cwd, [
    "diff",
    "--name-only",
    "--no-renames",
    "-z",
    pullRequest ? `${base}...${head}` : base,
    ...(pullRequest ? [] : [head]),
    "--",
  ])
    .split("\0")
    .filter(Boolean);
}
type WorkflowEvent = {
  before?: string;
  inputs?: { application?: string };
  pull_request?: { base: { sha: string }; head: { sha: string } };
};
export function deploymentSelection(
  eventName: string,
  event: WorkflowEvent,
  head: string,
  cwd: string,
) {
  if (eventName === "workflow_dispatch") {
    const app = event.inputs?.application ?? "all";
    if (!["all", "studio", "fitness"].includes(app)) throw new Error("Unknown application.");
    return { fitness: app !== "studio", reason: "manual selection", studio: app !== "fitness" };
  }
  const base = event.pull_request?.base.sha ?? event.before;
  if (!base || /^0+$/.test(base))
    return { fitness: true, reason: "initial push; both apps", studio: true };
  try {
    return {
      ...classifyChanges(
        changedPaths(cwd, base, event.pull_request?.head.sha ?? head, eventName === "pull_request"),
      ),
      reason: "changed paths",
    };
  } catch {
    // An unavailable pre-force-push commit must never make a changed app disappear.
    return { fitness: true, reason: "comparison unavailable; both apps", studio: true };
  }
}
export function currentDeployment(cwd: string, application: string, head: string) {
  if (application !== "studio" && application !== "fitness")
    throw new Error("Unknown application.");
  const main = git(cwd, ["rev-parse", "origin/main"]).trim();
  // Per-app deployment concurrency plus this check prevents an older, slower CI
  // run from rolling back a newer release. Changes to the other app do not skip it.
  return !classifyChanges(changedPaths(cwd, head, main))[application];
}
function output(values: Record<string, boolean | string>) {
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      Object.entries(values)
        .map(([key, value]) => `${key}=${value}\n`)
        .join(""),
    );
  process.stdout.write(`${JSON.stringify(values)}\n`);
}
function main() {
  if (process.argv[2] === "--paths") return output(classifyChanges(process.argv.slice(3)));
  if (process.argv[2] === "--current")
    return output({
      current: currentDeployment(
        process.cwd(),
        process.argv[3] ?? "",
        process.env.GITHUB_SHA ?? "",
      ),
    });
  const event = JSON.parse(
    readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8"),
  ) as WorkflowEvent;
  const selection = deploymentSelection(
    process.env.GITHUB_EVENT_NAME ?? "",
    event,
    process.env.GITHUB_SHA ?? "",
    process.cwd(),
  );
  output(selection);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `### Deployment selection\n\nStudio: **${selection.studio}** · Fitness: **${selection.fitness}**\n\n${selection.reason}.\n`,
    );
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
