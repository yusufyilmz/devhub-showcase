import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  findSymbol,
  getArtifactSection,
  searchCapabilities,
  searchCatalog,
  searchDesign,
  searchDocs,
  searchSkills,
} from "./engine.ts";
import { countLookupTokens } from "./output.ts";

const cli = path.join(import.meta.dirname, "cli.ts");
let root: string;
function write(file: string, text: string) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

describe("native repository lookup and CLI", () => {
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "repository-lookup-"));
    write("packages/.DS_Store", "ignored non-directory");
    write("packages/ui/src/en.json", '{"label":"fictional"}');
    write("pnpm-workspace.yaml", "packages:\n  - packages/*\n");
    write(
      "packages/ui/package.json",
      JSON.stringify({
        exports: {
          ".": { types: "./src/index.ts" },
          "./*": "./src/*.ts",
          "./button": "./src/button.ts",
        },
        name: "@shared/ui",
        version: "1.2.3",
      }),
    );
    write(
      "packages/ui/src/button.ts",
      "throw new Error('MUST NEVER EXECUTE');\nexport const Button = 1;\nexport interface ButtonProps { label: string }\nexport default Button;",
    );
    write(
      "packages/ui/src/index.ts",
      "export * from './button.js';\nexport { Button as Action } from './button.js';\nexport { default as locale } from './en.json';\n",
    );
    write(
      "packages/ui/CATALOG.md",
      "# UI catalog\n\n## Controls\n\n| Component | Use | Import |\n| --- | --- | --- |\n| Button | Submit a form | @shared/ui/button |\n| Card | Group content | @shared/ui/card |\n",
    );
    write(
      "docs/architecture.md",
      "# Architecture\n\n## Storage\nUse private repositories for storage.\n\n### Conflicts\nPreserve revisions when retrying writes.\n",
    );
    write(
      ".agents/skills/build-ui/SKILL.md",
      "---\nname: build-ui\ndescription: Build reusable controls\n---\n# Build UI\n\n## Workflow\nRead the catalog before building controls.\n",
    );
    write("DESIGN.md", "# Design\n\n## Spacing\nUse 8px for compact controls.\n");
  });
  afterEach(() => fs.rmSync(root, { force: true, recursive: true }));

  it("keeps native lookups available when .ai contains only a usage README", () => {
    write(".agents/README.md", "# AI lookup guide\nUse native repository artifacts.\n");
    expect(findSymbol("Button", { root }).response.total).toBe(2);
    expect(searchDesign("compact controls", { root }).response.results[0]?.artifact).toBe(
      "DESIGN.md",
    );
    expect(searchCatalog("submit form", { root }).response.total).toBe(1);
  });

  it("reads generic arrows in TypeScript sources", () => {
    write(
      "packages/ui/src/storage.ts",
      "export const chatStorage = {\n  persistence: <T>(scope: { id: string }) => scope as T,\n};\n",
    );
    const manifest = JSON.parse(
      fs.readFileSync(path.join(root, "packages/ui/package.json"), "utf8"),
    ) as { exports: Record<string, string> };
    manifest.exports["./storage"] = "./src/storage.ts";
    write("packages/ui/package.json", JSON.stringify(manifest));
    expect(findSymbol("chatStorage", { root }).response.total).toBe(1);
  });
  it("reads native exports and relative barrels without executing modules", () => {
    const output = findSymbol("Button", { root });
    expect(output.response.total).toBe(2);
    expect(output.response.results[0]).toMatchObject({
      audience: "UI",
      package: "@shared/ui",
      versions: { "@shared/ui": "1.2.3" },
    });
    expect(findSymbol("Action", { root }).response.total).toBe(1);
    expect(
      findSymbol("ButtonProps", { root }).response.results.every(
        (record) => record.kind === "type",
      ),
    ).toBe(true);
    expect(findSymbol("default", { root }).response.total).toBe(1);
    expect(output.response.unresolved).toBeGreaterThan(0);
  });
  it("searches compact catalog rows with their original headers and retrieves them by id", () => {
    const output = searchCatalog("submit form", { root });
    expect(output.response.total).toBe(1);
    const record = output.response.results[0]!;
    expect(record.content).toContain("| Component | Use | Import |");
    expect(record.content).not.toContain("Group content");
    expect(getArtifactSection(record.id, { root }).response.results[0]).toEqual(record);
    expect(searchCapabilities("submit form", { root }).response.results[0]).toEqual(record);
  });
  it("supports skill discovery, nested doc prerequisites and native design", () => {
    expect(searchSkills("building controls", { root }).response.total).toBe(1);
    const output = searchDocs("revisions", { root });
    expect(output.response.results[0]?.constraints?.join("\n")).toContain("private repositories");
    expect(searchDesign("compact controls", { root }).response.results[0]?.artifact).toBe(
      "DESIGN.md",
    );
    write("docs/short.md", "A short document about retries.");
    expect(searchDocs("retries", { root }).response.total).toBe(1);
  });
  it("detects stale doc ids and cursors after edits or file additions", () => {
    write("docs/second.md", "# Storage\n\n## Storage\nOther storage facts.\n");
    const output = searchDocs("storage", { limit: 1, root });
    expect(output.response.hasMore).toBe(true);
    expect(
      searchDocs("storage", { cursor: output.response.cursor, root }).response.results,
    ).toHaveLength(1);
    const id =
      output.response.results.find((record) => record.artifact === "docs/architecture.md")?.id ??
      searchDocs("private repositories", { root }).response.results[0]!.id;
    write("docs/architecture.md", "# Architecture\n\n## Storage\nChanged storage facts.\n");
    expect(getArtifactSection(id, { root }).response.error?.code).toBe("invalid_section");
    expect(
      searchDocs("storage", { cursor: output.response.cursor, root }).response.error?.code,
    ).toBe("invalid_cursor");
  });
  it("rejects escaped symlinks in native docs and source files", () => {
    fs.symlinkSync("/etc/hosts", path.join(root, "docs/escape.md"));
    expect(searchDocs("localhost", { root }).response.error?.code).toBe("unsafe_path");
    fs.unlinkSync(path.join(root, "packages/ui/src/button.ts"));
    fs.symlinkSync("/etc/hosts", path.join(root, "packages/ui/src/button.ts"));
    expect(findSymbol("Button", { root }).response.error?.code).toBe("unsafe_path");
  });
  it("runs CLI commands and aliases from nested directories with parseable bounded stdout", () => {
    for (const command of ["catalog", "lookup:catalog"]) {
      const result = spawnSync(
        process.execPath,
        [cli, command, "submit form", "--max-tokens", "700"],
        { cwd: path.join(root, "packages/ui"), encoding: "utf8" },
      );
      expect(result.status, result.stderr).toBe(0);
      const response = JSON.parse(result.stdout);
      expect(response.results[0].artifact).toBe("packages/ui/CATALOG.md");
      expect(countLookupTokens(result.stdout)).toBe(response.accounting.tokens);
      expect(response.accounting.tokens).toBeLessThanOrEqual(700);
    }
  });
  it("uses documented CLI exit codes for syntax errors, no match and tiny budgets", () => {
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [cli, ...args, "--root", root], { encoding: "utf8" });
    expect(run("docs", "absent").status).toBe(3);
    expect(run("docs", "storage", "--max-tokens", "1").status).toBe(4);
    expect(run("docs", "storage", "--limit", "0").status).toBe(2);
    expect(run("docs", "storage", "--format", "xml").status).toBe(1);
  });
});
