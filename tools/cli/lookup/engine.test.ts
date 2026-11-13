import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getEncoding } from "js-tiktoken";

import { findSymbol, getArtifactSection, searchCapabilities, searchDesign } from "./engine.ts";

let root: string;
const pkg = "@shared/storybook-app";
const manifest = {
  [pkg]: {
    "./amount-field": {
      audience: "UI",
      exports: ["AmountField", "type AmountFieldProps", "AmountAlias"],
    },
    "./form": { audience: "UI", exports: ["AmountField"] },
    "./patterns/*": {
      audience: "UI",
      exports: ["AmountField", "*", "* as Widgets"],
    },
  },
  "@shared/storybook-server": {
    ".": { audience: "SERVER", exports: ["AmountField"] },
  },
};
function write(file: string, content: string) {
  fs.mkdirSync(path.dirname(path.join(root, ".ai", file)), { recursive: true });
  fs.writeFileSync(path.join(root, ".ai", file), content);
}
function hashes() {
  return ["manifest.json", "catalogs/storybook-app-catalog.md", "DESIGN.md"].map((file) =>
    fs.readFileSync(path.join(root, ".ai", file), "utf8"),
  );
}
describe("read-only artifact lookup", () => {
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "storybook-lookup-"));
    fs.writeFileSync(path.join(root, "package.json"), '{"name":"synthetic-app"}');
    write("manifest.json", JSON.stringify(manifest));
    write(
      "catalogs/storybook-app-catalog.md",
      `---\nname: "${pkg}"\nversion: 6.2.0\n---\n# ${pkg}\n\n| Capability | Use for | Preferred import |\n| --- | --- | --- |\n| \`AmountField\` | Currency-aware numeric input. | \`${pkg}/amount-field\` |\n| \`NotExported\` | Currency input fake row. | \`${pkg}/absent\` |\n`,
    );
    write(
      "DESIGN.md",
      `---\npackages:\n  "${pkg}": 6.2.0\n---\n# Design\n\n## Visual direction\nKeep app providers; hiding UI is not authorization.\n\n## Spacing and layout\nForm spacing uses \`spaceTokens.sm\`: \`8px\`, not a theme factor.\n\n\`\`\`yaml\nspacing: 8px\n\`\`\`\n\n## Known gaps\nDark themes may override values; contrast is not certified.\n\n## Oversized\n${"Complete source facts with Unicode 🧪. ".repeat(2000)}\n`,
    );
  });
  afterEach(() => fs.rmSync(root, { force: true, recursive: true }));

  it("does not serialize redundant symbol names or return duplicate global constraints already carried by a design result", () => {
    expect(findSymbol("AmountField", { root }).response.results[0]).not.toHaveProperty("name");
    write("DESIGN.md", `${hashes()[2]}\n\n## Do and don't\nForm spacing must preserve focus.\n`);
    const result = searchDesign("form spacing", { root });
    expect(result.response.total).toBe(1);
    expect(result.response.results[0]?.constraints?.join("\n")).toContain(
      "Form spacing must preserve focus",
    );
  });
  it("preserves all exact owners, aliases and type export strings, excluding unresolved patterns", () => {
    const result = findSymbol("AmountField", { limit: 1, root });
    expect(result.response.status).toBe("ambiguous");
    expect(result.response.total).toBe(3);
    expect(result.response.selected).toBe(1);
    expect(result.response.hasMore).toBe(true);
    const next = findSymbol("AmountField", {
      cursor: result.response.cursor,
      limit: 5,
      root,
    });
    expect(next.response.results).toHaveLength(2);
    expect(
      new Set([...result.response.results, ...next.response.results].map((r) => r.id)).size,
    ).toBe(3);
    const types = findSymbol("type AmountFieldProps", { root });
    expect(types.response.results[0]).toMatchObject({
      export: "type AmountFieldProps",
      kind: "type",
      versions: { [pkg]: "6.2.0" },
    });
    expect(findSymbol("AmountAlias", { root }).response.total).toBe(1);
    expect(findSymbol("Widgets", { root }).response.status).toBe("no_match");
    expect(findSymbol("*", { root }).response.status).toBe("no_match");
  });
  it("filters exact package and established audience without selecting one owner implicitly", () => {
    expect(findSymbol("AmountField", { audience: "UI", package: pkg, root }).response.total).toBe(
      2,
    );
    expect(findSymbol("AmountField", { audience: "SERVER", root }).response.total).toBe(1);
  });
  it("labels suggestions separately and never supplies imports for them", () => {
    const result = findSymbol("AmountFiel", { root });
    expect(result.response.status).toBe("no_match");
    expect(result.response.results).toEqual([]);
    expect(result.response.suggestions).toContain("AmountField");
    expect(result.exitCode).toBe(3);
  });
  it("rejects malformed schema, missing artifacts, unsafe roots and stale cursors distinctly", () => {
    const cursor = findSymbol("AmountField", { limit: 1, root }).response.cursor;
    expect(findSymbol("AmountAlias", { cursor, root }).response.error?.code).toBe("invalid_cursor");
    write("manifest.json", JSON.stringify({ ...manifest, extra: { ".": { exports: [7] } } }));
    expect(findSymbol("AmountField", { cursor, root }).response.error?.code).toBe("invalid_schema");
    write(
      "manifest.json",
      JSON.stringify({
        ...manifest,
        [pkg]: { ...manifest[pkg], "./new": { exports: ["X"] } },
      }),
    );
    expect(findSymbol("AmountField", { cursor, root }).response.error?.code).toBe("invalid_cursor");
    fs.unlinkSync(path.join(root, ".ai/manifest.json"));
    expect(findSymbol("AmountField", { root }).response.error?.code).toBe("missing_artifact");
    fs.symlinkSync(path.join(os.tmpdir(), "not-an-artifact"), path.join(root, ".ai/manifest.json"));
    expect(findSymbol("AmountField", { root }).response.status).toBe("error");
  });
  it("ranks complete capability rows, verifies imports and retains purpose and provenance", () => {
    const result = searchCapabilities("currency input", { root });
    expect(result.response.results[0]).toMatchObject({
      artifact: ".ai/catalogs/storybook-app-catalog.md",
      audience: "UI",
      import: `${pkg}/amount-field`,
      name: "AmountField",
      purpose: "Currency-aware numeric input.",
    });
    expect(result.response.results).toHaveLength(1);
    expect(searchCapabilities("currency", { root }).stdout).toBe(
      searchCapabilities("currency", { root }).stdout,
    );
  });
  it("returns whole design sections with safety constraints, versions and exact examples", () => {
    const result = searchDesign("form spacing", { root });
    const record = result.response.results[0];
    expect(record).toMatchObject({
      heading: "Spacing and layout",
      versions: { [pkg]: "6.2.0" },
    });
    expect(record?.content).toContain("```yaml\nspacing: 8px\n```");
    expect(record?.constraints?.join("\n")).toContain("hiding UI is not authorization");
    expect(record?.constraints?.join("\n")).toContain("Dark themes");
    expect(getArtifactSection(record!.id, { root }).response.results[0]).toEqual(record);
    expect(getArtifactSection("../../package.json", { root }).response.error?.code).toBe(
      "invalid_section",
    );
    write("DESIGN.md", `${hashes()[2]}\nchanged snapshot\n`);
    expect(getArtifactSection(record!.id, { root }).response.error?.code).toBe("invalid_section");
  });
  it.each(["json", "text"] as const)(
    "counts final %s stdout with all metadata and newline and never truncates records",
    (format) => {
      const result = findSymbol("AmountField", { format, maxTokens: 800, root });
      const tokens = getEncoding("cl100k_base").encode(result.stdout).length;
      expect(tokens).toBeLessThanOrEqual(800);
      expect(result.response.accounting.tokens).toBe(tokens);
      expect(result.response.accounting).toMatchObject({
        encoding: "cl100k_base",
        package: "js-tiktoken",
        version: "1.0.21",
      });
      if (format === "json") expect(JSON.parse(result.stdout)).toEqual(result.response);
    },
  );
  it("returns a complete bounded locator rather than silently dropping an oversized section", () => {
    const result = searchDesign("Oversized", { maxTokens: 1500, root });
    expect(result.response.status).toBe("budget_too_small");
    expect(result.response.locator?.heading).toBe("Oversized");
    expect(result.response.error?.message).toContain("max-tokens");
    expect(result.exitCode).toBe(4);
    expect(getEncoding("cl100k_base").encode(result.stdout).length).toBeLessThanOrEqual(1500);
    const tiny = findSymbol("AmountField", { maxTokens: 1, root });
    expect(tiny.exitCode).toBe(4);
    expect(tiny.stdout).toBe("");
  });
  it("rejects out-of-root symlinked artifacts and invalid audience schemas", () => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "storybook-outside-"));
    try {
      fs.writeFileSync(path.join(outside, "manifest.json"), JSON.stringify(manifest));
      fs.unlinkSync(path.join(root, ".ai/manifest.json"));
      fs.symlinkSync(path.join(outside, "manifest.json"), path.join(root, ".ai/manifest.json"));
      expect(findSymbol("AmountField", { root }).response.error?.code).toBe("unsafe_path");
      fs.unlinkSync(path.join(root, ".ai/manifest.json"));
      write(
        "manifest.json",
        JSON.stringify({
          [pkg]: {
            ".": { audience: "NOT_AN_AUDIENCE", exports: ["AmountField"] },
          },
        }),
      );
      expect(findSymbol("AmountField", { root }).response.error?.code).toBe("invalid_schema");
    } finally {
      fs.rmSync(outside, { force: true, recursive: true });
    }
  });
  it("rejects invalid arguments and malformed cursors and keeps wildcard-only inventories unresolved", () => {
    for (const limit of [0, -1, 1.5, Number.NaN])
      expect(findSymbol("X", { limit, root }).response.error?.code).toBe("invalid_argument");
    expect(findSymbol(" ", { root }).response.error?.code).toBe("invalid_argument");
    expect(findSymbol("AmountField", { cursor: "../../outside", root }).response.error?.code).toBe(
      "invalid_cursor",
    );
    write(
      "manifest.json",
      JSON.stringify({
        [pkg]: {
          ".": { exports: ["*", "* as Namespace"] },
          "./*": { exports: ["AmountField"] },
        },
      }),
    );
    const result = findSymbol("AmountField", { root });
    expect(result.response.status).toBe("no_match");
    expect(result.response.unresolved).toBe(3);
  });
  it("preserves parent prerequisites and versions when retrieving a recipe", () => {
    write(
      "DESIGN.md",
      `---\npackages:\n  "${pkg}": 6.2.0\n---\n# Guide\n\n## Component recipes\nUse matching installed declarations and existing providers.\n\n### Synthetic recipe\nPublic import fact, retain disabled states.\n\n## Known gaps\nNo contrast certification.\n`,
    );
    const record = searchDesign("Synthetic recipe", { package: pkg, root }).response.results[0]!;
    expect(record.content).toContain("disabled states");
    expect(record.constraints?.join("\n")).toContain("existing providers");
    expect(record.versions[pkg]).toBe("6.2.0");
    expect(searchDesign("Synthetic recipe", { package: "@shared/absent", root }).exitCode).toBe(3);
  });
  it("leaves artifact contents and directory entries unchanged", () => {
    const before = hashes();
    const entries = fs.readdirSync(root);
    findSymbol("AmountField", { root });
    searchCapabilities("currency", { root });
    searchDesign("spacing", { root });
    expect(hashes()).toEqual(before);
    expect(fs.readdirSync(root)).toEqual(entries);
  });
});
