import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  formatDepcheckOutput,
  runDepcheckWorkspaces,
  workspacePackageDirs,
} from "./depcheck-workspaces.ts";

describe("depcheck workspaces", () => {
  it("checks each app, package, and tool that has its own package.json", () => {
    const root = mkdtempSync(join(tmpdir(), "depcheck-workspaces-"));
    mkdirSync(join(root, "apps", "studio"), { recursive: true });
    mkdirSync(join(root, "packages", "ui"), { recursive: true });
    mkdirSync(join(root, "packages", "ui", "nested"), { recursive: true });
    mkdirSync(join(root, "tools", "cli"), { recursive: true });
    mkdirSync(join(root, "tools", "notes"), { recursive: true });
    writeFileSync(join(root, "apps", "studio", "package.json"), "{}");
    writeFileSync(join(root, "packages", "ui", "package.json"), "{}");
    writeFileSync(join(root, "packages", "ui", "nested", "package.json"), "{}");
    writeFileSync(join(root, "tools", "cli", "package.json"), "{}");

    const calls: Array<{ config: string; directory: string }> = [];
    const code = runDepcheckWorkspaces({
      root,
      run: (directory, config) => {
        calls.push({ config, directory });
        return directory.endsWith("/packages/ui") ? 1 : 0;
      },
    });

    expect(workspacePackageDirs(root)).toEqual([
      join(root, "apps", "studio"),
      join(root, "packages", "ui"),
      join(root, "tools", "cli"),
    ]);
    expect(calls).toEqual([
      { config: join(root, ".depcheckrc"), directory: join(root, "apps", "studio") },
      { config: join(root, ".depcheckrc"), directory: join(root, "packages", "ui") },
      { config: join(root, ".depcheckrc"), directory: join(root, "tools", "cli") },
    ]);
    expect(code).toBe(1);
    rmSync(root, { recursive: true });
  });

  it("treats a clean depcheck report as success and keeps finding lines", () => {
    expect(formatDepcheckOutput("No depcheck issue\n")).toEqual({ lines: [], ok: true });
    expect(formatDepcheckOutput("")).toEqual({ lines: [], ok: true });
    expect(
      formatDepcheckOutput(
        "Unused dependencies\n* tailwindcss\nMissing dependencies\n* vitest: ./a.test.ts\n",
      ),
    ).toEqual({
      lines: [
        "Unused dependencies",
        "* tailwindcss",
        "Missing dependencies",
        "* vitest: ./a.test.ts",
      ],
      ok: false,
    });
  });
});
