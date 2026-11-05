import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { parse } from "yaml";

import { changedPaths, classifyChanges, currentDeployment, deploymentSelection } from "./changes";

const directories: string[] = [];
function repository() {
  const cwd = mkdtempSync(join(tmpdir(), "app-selection-"));
  directories.push(cwd);
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "--initial-branch=main");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.com");
  git("config", "commit.gpgsign", "false");
  const commit = (path: string, value = "fixture") => {
    const target = join(cwd, path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, value);
    git("add", "--all");
    git("commit", "--quiet", "-m", "fixture");
    return git("rev-parse", "HEAD");
  };
  return { commit, cwd, git };
}
describe("application deployment selection", () => {
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { force: true, recursive: true });
  });
  it.each([
    ["apps/my-dev-studio/app/page.tsx", true, false],
    ["apps/my-fitness-app/app/page.tsx", false, true],
    ["packages/ui/src/Button.tsx", true, true],
    ["packages/notifications/src/worker.ts", true, true],
    ["tools/cli/ci/changes.ts", true, true],
    ["pnpm-lock.yaml", true, true],
    ["package.json", true, true],
    ["turbo.json", true, true],
    ["tsconfig.json", true, true],
    [".github/workflows/ci.yml", true, true],
    ["docs/testing/manual/notifications.md", false, false],
    ["apps/storybook-app/src/demo.tsx", false, false],
  ])("selects relevant apps for %s", (path, studio, fitness) => {
    expect(classifyChanges([path as string])).toEqual({ fitness, studio });
  });
  it("uses the entire multi-commit push, preserving unusual filenames", () => {
    const { cwd, commit } = repository();
    const before = commit("README.md");
    commit("apps/my-dev-studio/space and\nnewline.txt");
    const head = commit("apps/my-fitness-app/page.tsx");
    expect(changedPaths(cwd, before, head)).toContain("apps/my-dev-studio/space and\nnewline.txt");
    expect(deploymentSelection("push", { before }, head, cwd)).toMatchObject({
      fitness: true,
      studio: true,
    });
    expect(() => changedPaths(cwd, "--output=/tmp/not-a-ref", head)).toThrow("Expected commit IDs");
  });
  it("includes the old path when an app file is moved out of its directory", () => {
    const { cwd, git, commit } = repository();
    const before = commit("apps/my-dev-studio/page.tsx");
    mkdirSync(join(cwd, "docs"));
    renameSync(join(cwd, "apps/my-dev-studio/page.tsx"), join(cwd, "docs/example.tsx"));
    git("add", "--all");
    git("commit", "-qm", "move");
    expect(classifyChanges(changedPaths(cwd, before, git("rev-parse", "HEAD")))).toEqual({
      fitness: false,
      studio: true,
    });
  });
  it("compares a pull request from its merge base rather than including unrelated main changes", () => {
    const { cwd, git, commit } = repository();
    commit("README.md");
    git("branch", "feature");
    const base = commit("apps/my-fitness-app/main.ts");
    git("switch", "feature");
    const head = commit("apps/my-dev-studio/feature.ts");
    expect(
      deploymentSelection(
        "pull_request",
        { pull_request: { base: { sha: base }, head: { sha: head } } },
        head,
        cwd,
      ),
    ).toMatchObject({ fitness: false, studio: true });
  });
  it("builds both apps for initial pushes and unavailable force-push comparisons, with explicit manual targets", () => {
    const { cwd, commit } = repository();
    const head = commit("README.md");
    expect(deploymentSelection("push", { before: "0".repeat(40) }, head, cwd)).toMatchObject({
      fitness: true,
      studio: true,
    });
    expect(deploymentSelection("push", { before: "f".repeat(40) }, head, cwd)).toMatchObject({
      fitness: true,
      studio: true,
    });
    expect(
      deploymentSelection("workflow_dispatch", { inputs: { application: "fitness" } }, head, cwd),
    ).toMatchObject({ fitness: true, studio: false });
    expect(() =>
      deploymentSelection("workflow_dispatch", { inputs: { application: "arbitrary" } }, head, cwd),
    ).toThrow();
  });
  it("prevents stale app rollbacks without dropping a release when only the other app changed", () => {
    const { cwd, git, commit } = repository();
    const earlier = commit("apps/my-dev-studio/page.tsx");
    let latest = commit("apps/my-fitness-app/page.tsx");
    git("update-ref", "refs/remotes/origin/main", latest);
    expect(currentDeployment(cwd, "studio", earlier)).toBe(true);
    expect(currentDeployment(cwd, "fitness", earlier)).toBe(false);
    latest = commit("packages/ui/button.tsx");
    git("update-ref", "refs/remotes/origin/main", latest);
    expect(currentDeployment(cwd, "studio", earlier)).toBe(false);
    expect(currentDeployment(cwd, "studio", latest)).toBe(true);
  });
  it.each(["my-dev-studio", "my-fitness-app"])(
    "skips unrelated Vercel preview builds for %s and disables duplicate native production",
    (app) => {
      const config = JSON.parse(readFileSync(`apps/${app}/vercel.json`, "utf8")) as {
        git: { deploymentEnabled: { main: boolean } };
        buildCommand: string;
        ignoreCommand: string;
      };
      expect(config.git.deploymentEnabled.main).toBe(false);
      expect(config.ignoreCommand.length).toBeLessThanOrEqual(256);
      expect(config.buildCommand).toContain(`--filter ${app} build`);
      const { cwd, commit } = repository();
      mkdirSync(join(cwd, "tools/cli/ci"), { recursive: true });
      writeFileSync(
        join(cwd, "tools/cli/ci/ignore-build.sh"),
        readFileSync("tools/cli/ci/ignore-build.sh"),
      );
      const base = commit(`apps/${app}/page.tsx`);
      const other = app === "my-dev-studio" ? "my-fitness-app" : "my-dev-studio";
      commit(`apps/${other}/page.tsx`);
      const check = (previous: string) =>
        spawnSync("sh", ["-c", config.ignoreCommand], {
          cwd: join(cwd, "apps", app),
          env: { ...process.env, VERCEL_GIT_PREVIOUS_SHA: previous },
        }).status;
      expect(check(base)).toBe(0); // Vercel's zero exit means skip.
      commit("packages/ui/button.tsx");
      expect(check(base)).toBe(1);
      expect(check("")).toBe(1); // No deployment baseline: build rather than miss changes.
    },
  );
});

type Job = {
  if?: string;
  "runs-on"?: unknown;
  steps?: { uses?: string }[];
  needs?: string[];
  secrets?: Record<string, string>;
};
const workflowJobs = readdirSync(".github/workflows")
  .filter((file) => /\.ya?ml$/.test(file))
  .flatMap((file) => {
    const workflow = parse(readFileSync(`.github/workflows/${file}`, "utf8")) as {
      jobs: Record<string, Job>;
    };
    return Object.entries(workflow.jobs).map(([name, job]) => [file, name, job] as const);
  });
describe("free-only workflow policy", () => {
  it.each(workflowJobs)(
    "keeps %s / %s on free public runners without artifacts",
    (file, _name, job) => {
      expect(job.if, file).toContain("github.event.repository.private == false");
      if (job["runs-on"]) expect(job["runs-on"], file).toBe("ubuntu-latest");
      for (const step of job.steps ?? []) {
        expect(step.uses ?? "", file).not.toMatch(/upload-artifact|save-artifact/);
        if (step.uses && !step.uses.startsWith("./"))
          expect(step.uses, file).toMatch(/@[a-f\d]{40}$/);
      }
    },
  );
  it("requires verification and affected-app selection before either production deployment", () => {
    const workflow = parse(readFileSync(".github/workflows/ci.yml", "utf8")) as {
      jobs: Record<string, Job>;
    };
    for (const app of ["studio", "fitness"]) {
      const job = workflow.jobs[`deploy-${app}`]!;
      expect(job.needs).toEqual(["changes", "verify"]);
      expect(job.if).toContain(`needs.changes.outputs.${app} == 'true'`);
      expect(job.if).toContain("github.ref == 'refs/heads/main'");
      expect(job.if).toContain("github.event_name != 'pull_request'");
    }
    expect(workflow.jobs["deploy-fitness"]?.secrets?.DEPLOY_PROJECT_ID).toContain(
      "vars.VERCEL_FITNESS_PROJECT_ID",
    );
  });
});
