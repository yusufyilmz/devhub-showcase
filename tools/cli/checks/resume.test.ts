import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  CHECK_ALL_STEPS,
  checkAllFresh,
  readCheckAllCache,
  runCheckAll,
  writeCheckAllCache,
} from "./resume.ts";

const packageScripts = Object.keys(
  JSON.parse(readFileSync(new URL("../../../package.json", import.meta.url), "utf8")).scripts,
) as string[];

describe("check:all resume", () => {
  it("runs the repository checks except the umbrellas, check:ci, the fixer, and the knip export checks", () => {
    expect(CHECK_ALL_STEPS).toEqual([
      "check:lint",
      "check:format",
      "check:assist",
      "check:catalogs",
      "check:exports",
      "check:packages",
      "check:ui-catalog",
      "check:docs",
      "check:links",
      "check:skills",
      "check:architecture",
      "check:circular",
      "check:complexity",
      "check:duplicates",
      "check:depcheck",
      "check:depcheck:workspaces",
      "check:unused:deps",
      "check:unused:files",
      "check:secrets",
      "check:security",
      "check:security:prod",
      "check:outdated",
      "check:types",
      "check:unit",
      "check:coverage",
      "check:build",
    ]);
    expect(CHECK_ALL_STEPS).not.toContain("check");
    expect(CHECK_ALL_STEPS).not.toContain("check:fix");
    expect([...CHECK_ALL_STEPS].sort()).toEqual(
      packageScripts
        .filter(
          (name) =>
            name.startsWith("check:") &&
            name !== "check:all" &&
            name !== "check:ci" &&
            name !== "check:fix" &&
            name !== "check:unused:all" &&
            name !== "check:unused:code" &&
            name !== "check:unused:namespaces",
        )
        .sort(),
    );
  });

  it("logs the step that is running, each pass, and the step that failed", () => {
    const lines: string[] = [];
    const log = {
      error: (message: string) => lines.push(`error ${message}`),
      info: (message: string) => lines.push(`info ${message}`),
      start: (message: string) => lines.push(`start ${message}`),
      success: (message: string) => lines.push(`success ${message}`),
    };

    const code = runCheckAll({
      cache: null,
      fresh: false,
      log,
      onCache: () => {},
      run: (script) => (script === "check:format" ? 1 : 0),
      steps: ["check:lint", "check:format", "check:types"],
    });

    expect(code).toBe(1);
    expect(lines).toEqual([
      "start 1/3 check:lint",
      "success check:lint passed",
      "start 2/3 check:format",
      "error check:format failed with exit 1. Next pnpm check:all continues here.",
    ]);
  });

  it("logs a resume and the completed run", () => {
    const lines: string[] = [];
    const log = {
      error: (message: string) => lines.push(`error ${message}`),
      info: (message: string) => lines.push(`info ${message}`),
      start: (message: string) => lines.push(`start ${message}`),
      success: (message: string) => lines.push(`success ${message}`),
    };

    runCheckAll({
      cache: { next: "check:format", steps: ["check:lint", "check:format"], version: 1 },
      fresh: false,
      log,
      onCache: () => {},
      run: () => 0,
      steps: ["check:lint", "check:format"],
    });

    expect(lines).toEqual([
      "info Resuming at check:format. 1 earlier step cached.",
      "start 2/2 check:format",
      "success check:format passed",
      "success All 2 checks passed.",
    ]);
  });

  it("stops on the first failure and records that step as the resume point", () => {
    const ran: string[] = [];
    let saved: ReturnType<typeof readCheckAllCache> = null;

    const code = runCheckAll({
      cache: null,
      fresh: false,
      onCache: (cache) => {
        saved = cache;
      },
      run: (script) => {
        ran.push(script);
        return script === "check:exports" ? 2 : 0;
      },
      steps: CHECK_ALL_STEPS,
    });

    expect(code).toBe(2);
    expect(ran).toEqual([
      "check:lint",
      "check:format",
      "check:assist",
      "check:catalogs",
      "check:exports",
    ]);
    expect(saved).toEqual({
      next: "check:exports",
      steps: [...CHECK_ALL_STEPS],
      version: 1,
    });
  });

  it("continues from the cached failure and clears the cache after the rest pass", () => {
    const ran: string[] = [];
    const writes: ReturnType<typeof readCheckAllCache>[] = [];

    const code = runCheckAll({
      cache: {
        next: "check:exports",
        steps: [...CHECK_ALL_STEPS],
        version: 1,
      },
      fresh: false,
      onCache: (cache) => {
        writes.push(cache);
      },
      run: (script) => {
        ran.push(script);
        return 0;
      },
      steps: CHECK_ALL_STEPS,
    });

    expect(code).toBe(0);
    expect(ran[0]).toBe("check:exports");
    expect(ran).toEqual(CHECK_ALL_STEPS.slice(CHECK_ALL_STEPS.indexOf("check:exports")));
    expect(writes.at(-1)).toBeNull();
  });

  it("starts over when asked to ignore the cache", () => {
    const ran: string[] = [];

    runCheckAll({
      cache: {
        next: "check:types",
        steps: [...CHECK_ALL_STEPS],
        version: 1,
      },
      fresh: true,
      onCache: () => {},
      run: (script) => {
        ran.push(script);
        return script === "check:lint" ? 1 : 0;
      },
      steps: CHECK_ALL_STEPS,
    });

    expect(ran).toEqual(["check:lint"]);
  });

  it("starts over when the saved step list no longer matches", () => {
    const ran: string[] = [];

    runCheckAll({
      cache: {
        next: "check:types",
        steps: ["check:lint"],
        version: 1,
      },
      fresh: false,
      onCache: () => {},
      run: (script) => {
        ran.push(script);
        return 1;
      },
      steps: ["check:lint", "check:types"],
    });

    expect(ran).toEqual(["check:lint"]);
  });

  it("accepts --fresh with or without a pnpm argument separator", () => {
    expect(checkAllFresh(["--fresh"])).toBe(true);
    expect(checkAllFresh(["--", "--fresh"])).toBe(true);
    expect(checkAllFresh([])).toBe(false);
  });

  it("round-trips the cache file and treats a corrupt file as a fresh start", () => {
    const directory = mkdtempSync(join(tmpdir(), "check-all-"));
    const file = join(directory, "check-all.json");
    const cache = {
      next: "check:types",
      steps: [...CHECK_ALL_STEPS],
      version: 1 as const,
    };

    writeCheckAllCache(file, cache);
    expect(readCheckAllCache(file)).toEqual(cache);
    expect(JSON.parse(readFileSync(file, "utf8"))).toEqual(cache);

    writeCheckAllCache(file, null);
    expect(readCheckAllCache(file)).toBeNull();

    writeFileSync(file, "{", "utf8");
    expect(readCheckAllCache(file)).toBeNull();
    rmSync(directory, { recursive: true });
  });
});
