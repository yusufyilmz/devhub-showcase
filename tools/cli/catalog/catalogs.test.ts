import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { findSymbol, searchCatalog } from "../lookup/engine.ts";
import { generateCatalogs } from "./catalogs.ts";

let root: string;
const cli = path.resolve(import.meta.dirname, "../scripts/generate-catalogs.mjs");
function write(file: string, value: string) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
}
function read(file: string) {
  return fs.readFileSync(path.join(root, file), "utf8");
}
function manifest(name = "@shared/example", extra: Record<string, unknown> = {}) {
  return JSON.stringify({ exports: { ".": "./src/index.ts" }, name, version: "1.0.0", ...extra });
}

describe("workspace catalog generation", () => {
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "catalog-generator-"));
    write("pnpm-workspace.yaml", "packages:\n  - packages/*\n  - tools/*\n  - apps/*\n");
    write("packages/example/package.json", manifest());
    write(
      "packages/example/src/index.ts",
      "throw new Error('Do not execute project code');\nexport const Example = 1;\nexport interface ExampleOptions { name: string }\n",
    );
  });
  afterEach(() => fs.rmSync(root, { force: true, recursive: true }));
  it("preserves authored guidance and generates imports, declared symbols, scripts and dependencies", () => {
    write(
      "packages/example/CATALOG.md",
      "# Existing catalog\n\nRetain this ownership and privacy guidance.\n",
    );
    write(
      "packages/example/package.json",
      manifest("@shared/example", {
        dependencies: { example: "catalog:" },
        scripts: { test: "vitest run" },
      }),
    );
    const result = generateCatalogs({ root });
    expect(result.changed).toEqual(["packages/example"]);
    expect(read("packages/example/catalog.template.md")).toContain(
      "Retain this ownership and privacy guidance.",
    );
    const catalog = read("packages/example/CATALOG.md");
    for (const expected of [
      "@shared/example",
      "Example",
      "type ExampleOptions",
      "vitest run",
      "catalog:",
    ])
      expect(catalog).toContain(expected);
    expect(catalog).not.toContain("Do not execute project code");
  });
  it("discovers apps and tools from workspace patterns and respects exclusions", () => {
    write("apps/site/package.json", JSON.stringify({ name: "site", scripts: { dev: "next dev" } }));
    write(
      "tools/tool/package.json",
      manifest("@shared/tool", { exports: { "./config.json": "./config.json" } }),
    );
    write("tools/tool/config.json", "{}");
    write("apps/ignored/package.json", JSON.stringify({ name: "ignored" }));
    write("pnpm-workspace.yaml", `${read("pnpm-workspace.yaml")}  - '!apps/ignored'\n`);
    expect(generateCatalogs({ root }).packages).toEqual([
      "site",
      "@shared/example",
      "@shared/tool",
    ]);
    expect(read("apps/site/CATALOG.md")).toContain("No public package export map");
    expect(fs.existsSync(path.join(root, "apps/ignored/CATALOG.md"))).toBe(false);
  });
  it("is deterministic and checks stale sources without writing", () => {
    generateCatalogs({ root });
    const file = path.join(root, "packages/example/CATALOG.md");
    const before = fs.statSync(file).mtimeMs;
    expect(generateCatalogs({ root }).changed).toEqual([]);
    expect(fs.statSync(file).mtimeMs).toBe(before);
    write("packages/example/src/index.ts", "export const Renamed = 2;\n");
    const contents = fs.readFileSync(file, "utf8");
    expect(generateCatalogs({ check: true, root }).stale).toEqual(["packages/example"]);
    expect(fs.readFileSync(file, "utf8")).toBe(contents);
    generateCatalogs({ root });
    expect(read("packages/example/CATALOG.md")).toContain("Renamed");
  });
  it("check mode does not create templates or catalogs for a new package", () => {
    expect(generateCatalogs({ check: true, root }).stale).toEqual(["packages/example"]);
    expect(fs.readdirSync(path.join(root, "packages/example")).sort()).toEqual([
      "package.json",
      "src",
    ]);
  });
  it("filters by exact workspace package name and rejects unknown selections", () => {
    write("tools/tool/package.json", manifest("@shared/tool", { exports: null }));
    expect(generateCatalogs({ package: "@shared/tool", root }).packages).toEqual(["@shared/tool"]);
    expect(fs.existsSync(path.join(root, "packages/example/CATALOG.md"))).toBe(false);
    expect(() => generateCatalogs({ package: "missing", root })).toThrow(
      "Unknown workspace package",
    );
  });
  it("keeps conditional paths and wildcard patterns explicit without inventing symbols", () => {
    write(
      "packages/example/package.json",
      manifest("@shared/example", {
        exports: {
          ".": { import: "./src/index.ts", types: "./src/index.ts" },
          "./assets/*": "./assets/*.json",
          "./internal": null,
        },
      }),
    );
    generateCatalogs({ root });
    const catalog = read("packages/example/CATALOG.md");
    expect(catalog).toContain("types: ./src/index.ts");
    expect(catalog).toContain("@shared/example/assets/*");
    expect(catalog).not.toContain("@shared/example/internal");
  });
  it("validates every template before writing any package", () => {
    write("tools/tool/package.json", manifest("@shared/tool", { exports: null }));
    write("tools/tool/catalog.template.md", "# Broken\n<!-- catalog:unknown -->\n");
    expect(() => generateCatalogs({ root })).toThrow("Unknown catalog marker");
    expect(fs.existsSync(path.join(root, "packages/example/CATALOG.md"))).toBe(false);
  });
  it("rejects symlinked output and unsafe workspace paths", () => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "catalog-outside-"));
    try {
      const target = path.join(outside, "catalog.md");
      fs.writeFileSync(target, "keep");
      fs.symlinkSync(target, path.join(root, "packages/example/CATALOG.md"));
      expect(() => generateCatalogs({ root })).toThrow("Symlinked catalog");
      expect(fs.readFileSync(target, "utf8")).toBe("keep");
      write("pnpm-workspace.yaml", "packages:\n  - '../outside/*'\n");
      expect(() => generateCatalogs({ root })).toThrow("Unsafe workspace pattern");
    } finally {
      fs.rmSync(outside, { force: true, recursive: true });
    }
  });
  it("generates and looks up tool-package exports as well as library catalogs", () => {
    write("tools/helper/package.json", manifest("@shared/helper"));
    write("tools/helper/src/index.ts", "export const ToolHelper = 1;\n");
    generateCatalogs({ package: "@shared/helper", root });
    expect(read("tools/helper/CATALOG.md")).toContain("ToolHelper");
    expect(findSymbol("ToolHelper", { root }).response.results[0]?.artifact).toBe(
      "tools/helper/src/index.ts",
    );
    expect(searchCatalog("ToolHelper", { package: "@shared/helper", root }).response.total).toBe(1);
  });
  it("preserves Markdown-sensitive script commands without changing their meaning", () => {
    write(
      "packages/example/package.json",
      manifest("@shared/example", {
        scripts: { sample: "node -e 'console.log(`example`)' | cat" },
      }),
    );
    generateCatalogs({ root });
    expect(read("packages/example/CATALOG.md")).toContain("console.log(`example`)");
    expect(read("packages/example/CATALOG.md")).toContain("\\| cat");
  });
  it("rejects broken output symlinks and missing generated-source templates", () => {
    const outside = path.join(os.tmpdir(), `catalog-missing-${path.basename(root)}.md`);
    const catalog = path.join(root, "packages/example/CATALOG.md");
    fs.symlinkSync(outside, catalog);
    expect(() => generateCatalogs({ root })).toThrow("Symlinked catalog");
    expect(fs.existsSync(outside)).toBe(false);
    fs.unlinkSync(catalog);
    generateCatalogs({ root });
    const before = read("packages/example/CATALOG.md");
    expect(fs.existsSync(path.join(root, "packages/example/catalog.template.md"))).toBe(false);
    generateCatalogs({ root });
    expect(read("packages/example/CATALOG.md")).toBe(before);
  });
  it("generates declared symbols for packages outside the shared scope", () => {
    write("packages/example/package.json", manifest("@vendor/example"));
    generateCatalogs({ root });
    expect(read("packages/example/CATALOG.md")).toContain("type ExampleOptions");
  });
  it("reports CLI failures distinctly and supports a selected package", () => {
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [cli, "--root", root, ...args], { encoding: "utf8" });
    expect(run("--check").status).toBe(1);
    const generated = run("--package", "@shared/example");
    expect(generated.status, generated.stderr).toBe(0);
    expect(run("--check").status).toBe(0);
    expect(run("--package", "unknown").status).toBe(2);
    expect(run("--unknown").status).toBe(2);
  });
});
