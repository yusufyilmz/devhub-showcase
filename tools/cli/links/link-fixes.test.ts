import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { applyLinkFixPlan, buildLinkFixPlan, fingerprintLinkFixPlan } from "./link-fixes.ts";
import { extractLinkDestinations, validateLocalLinks } from "./markdown-links.ts";

let root: string;
function write(name: string, text: string): string {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return file;
}
beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "link-fix-")));
});
afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(root, { force: true, recursive: true });
});

describe("missing local Markdown link repairs", () => {
  it("computes root-relative replacements from the repository root", () => {
    const target = write("docs/workflows/build-release.md", "# Build\n");
    const file = write("docs/guide.md", "[Build](./docs/workflows/build-release.md)");
    const plan = buildLinkFixPlan([file], root, [target, file]);
    expect(plan.changes[0]?.after).toBe("[Build](/docs/workflows/build-release.md)");
    expect(fs.readFileSync(file, "utf8")).toContain("./docs/");
  });
  it("falls back to a unique basename without parent-directory navigation", () => {
    const target = write("docs/new/guide.md", "# Guide\n");
    const file = write("docs/deep/index.md", "[Guide](old/guide.md)");
    expect(buildLinkFixPlan([file], root, [target]).changes[0]?.after).toBe(
      "[Guide](/docs/new/guide.md)",
    );
  });
  it("prefers a unique longer suffix over duplicate basenames", () => {
    const first = write("docs/workflows/build.md", "# Build\n");
    const other = write("design/build.md", "# Build\n");
    const file = write("README.md", "[Build](gone/workflows/build.md)");
    expect(buildLinkFixPlan([file], root, [other, first]).changes[0]?.after).toBe(
      "[Build](/docs/workflows/build.md)",
    );
  });
  it("does not pick the first match when a suffix is ambiguous", () => {
    const a = write("a/workflows/build.md", "# Build\n");
    const b = write("b/workflows/build.md", "# Build\n");
    const file = write("README.md", "[Build](gone/workflows/build.md)");
    const plan = buildLinkFixPlan([file], root, [a, b]);
    expect(plan.changes).toEqual([]);
    expect(plan.skipped[0]).toContain("ambiguous");
  });
  it("encodes paths and preserves query, fragment, title and CRLF", () => {
    const target = write("docs/my (guide).md", "# Hello\n");
    const file = write("README.md", '[Guide](<old/my%20(guide).md?raw=1#hello> "A title")\r\n');
    expect(buildLinkFixPlan([file], root, [target]).changes[0]?.after).toBe(
      '[Guide](</docs/my%20%28guide%29.md?raw=1#hello> "A title")\r\n',
    );
  });
  it("edits a reference definition once without changing its uses", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write("README.md", '[Build][ref]\n[ref]\n[ref]: old/build.md#build "Title"\n');
    const plan = buildLinkFixPlan([file], root, [target]);
    expect(plan.changes[0]?.links).toHaveLength(1);
    expect(plan.changes[0]?.after).toBe(
      '[Build][ref]\n[ref]\n[ref]: /docs/build.md#build "Title"\n',
    );
  });
  it("leaves duplicate reference definitions unmodified", () => {
    const file = write("README.md", "[a]: old/a.md\n[a]: older/a.md\n");
    const target = write("docs/a.md", "# A\n");
    expect(buildLinkFixPlan([file], root, [target]).changes).toEqual([]);
  });
  it("does not touch comments, code examples, external URLs or anchor-only links", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write(
      "README.md",
      "<!-- [x](old/build.md) -->\n`[x](old/build.md)`\n~~~md\n[x](old/build.md)\n~~~\n[x](https://example.invalid/build.md)\n[x](#build)\n",
    );
    expect(buildLinkFixPlan([file], root, [target]).changes).toEqual([]);
  });
  it("does not rewrite existing destinations or repair invalid anchors by relocation", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write("README.md", "[x](docs/build.md#absent)\n[x](old/build.md#absent)\n");
    const plan = buildLinkFixPlan([file], root, [target]);
    expect(plan.changes).toEqual([]);
    expect(plan.skipped[0]).toContain("lacks anchor");
  });
  it("rejects escaping paths and unsafe symlink candidates", () => {
    const target = write("docs/build.md", "# Build\n");
    const shortcut = path.join(root, "shortcut.md");
    fs.symlinkSync(target, shortcut);
    const file = write("README.md", "[x](../../build.md)\n[x](gone/shortcut.md)");
    const plan = buildLinkFixPlan([file], root, [shortcut]);
    expect(plan.changes).toEqual([]);
    expect(plan.skipped.join("\n")).toContain("escapes root");
  });
  it("supports root-relative links and multiple replacements", () => {
    const a = write("docs/a.md", "# A\n");
    const b = write("docs/b.md", "# B\n");
    const file = write("docs/index.md", "[A](/old/a.md) [B](gone/b.md)");
    expect(buildLinkFixPlan([file], root, [a, b]).changes[0]?.after).toBe(
      "[A](/docs/a.md) [B](/docs/b.md)",
    );
  });
  it("produces stable fingerprints regardless of search order", () => {
    const a = write("docs/a.md", "# A\n");
    const b = write("docs/b.md", "# B\n");
    const file = write("README.md", "[A](old/a.md) [B](old/b.md)");
    expect(fingerprintLinkFixPlan(buildLinkFixPlan([file], root, [a, b]))).toBe(
      fingerprintLinkFixPlan(buildLinkFixPlan([file], root, [b, a])),
    );
  });
  it("backs up edits, validates the result, and makes repeat runs no-ops", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write("README.md", "[Build](old/build.md#build)");
    const plan = buildLinkFixPlan([file], root, [target]);
    const backup = applyLinkFixPlan(plan);
    expect(backup).toBeTruthy();
    expect(fs.readFileSync(path.join(backup ?? "", "0"), "utf8")).toBe(plan.changes[0]?.before);
    expect(validateLocalLinks([file], root)).toEqual([]);
    expect(buildLinkFixPlan([file], root, [target]).changes).toEqual([]);
  });
  it("rejects changed source and destination contents", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write("README.md", "[Build](old/build.md)");
    const plan = buildLinkFixPlan([file], root, [target]);
    fs.writeFileSync(file, "new content");
    expect(() => applyLinkFixPlan(plan)).toThrow("Changed since preview");
    fs.writeFileSync(file, plan.changes[0]?.before ?? "");
    fs.writeFileSync(target, "# Changed\n");
    expect(() => applyLinkFixPlan(plan)).toThrow("Destination changed");
  });
  it("rejects an original target appearing after preview", () => {
    const target = write("docs/build.md", "# Build\n");
    const file = write("README.md", "[Build](old/build.md)");
    const plan = buildLinkFixPlan([file], root, [target]);
    write("old/build.md", "# Old\n");
    expect(() => applyLinkFixPlan(plan)).toThrow("Original destination now exists");
  });
  it("handles targets that are also changed documents", () => {
    const a = write("docs/a.md", "[B](old/b.md)");
    const b = write("docs/b.md", "[A](old/a.md)");
    applyLinkFixPlan(buildLinkFixPlan([a, b], root, [a, b]));
    expect(validateLocalLinks([a, b], root)).toEqual([]);
  });
  it("rolls back earlier edits when a later write fails", () => {
    const target = write("docs/build.md", "# Build\n");
    const a = write("a.md", "[Build](old/build.md)");
    const b = write("b.md", "[Build](old/build.md)");
    const plan = buildLinkFixPlan([a, b], root, [target]);
    const original = fs.writeFileSync.bind(fs);
    vi.spyOn(fs, "writeFileSync").mockImplementation(
      (...args: Parameters<typeof fs.writeFileSync>) => {
        if (String(args[0]) === b) throw new Error("simulated write failure");
        return original(...args);
      },
    );
    expect(() => applyLinkFixPlan(plan)).toThrow("simulated write failure");
    expect(fs.readFileSync(a, "utf8")).toBe(plan.changes[0]?.before);
    expect(fs.readFileSync(b, "utf8")).toBe(plan.changes[1]?.before);
  });
  it("returns offsets that match the original URL text", () => {
    const text = '[a](<old/a.md> "title")\n[ref]: old/b.md\n';
    for (const link of extractLinkDestinations(text))
      expect(text.slice(link.start, link.end)).toBe(link.url);
  });
});

describe("registry-based root-relative repairs", () => {
  it("indexes hidden AI documents and MDX destinations", () => {
    const target = write(".ai/skills/example/guide.mdx", "# Guide\n");
    const file = write(".ai/skills/deep/source.md", "[Guide](/gone/guide.mdx#guide)");
    const plan = buildLinkFixPlan([file], root, [target]);
    expect(plan.changes[0]?.after).toBe("[Guide](/.ai/skills/example/guide.mdx#guide)");
    expect(plan.registry).toEqual({ anchors: 1, documents: 1 });
  });
  it("preserves duplicate-heading fragments from the shared anchor parser", () => {
    const target = write("docs/testing/testing.md", "# Testing\n## Overview\n## Overview\n");
    const file = write("README.md", "[Testing](gone/testing.md#overview-1)");
    expect(buildLinkFixPlan([file], root, [target]).changes[0]?.after).toBe(
      "[Testing](/docs/testing/testing.md#overview-1)",
    );
  });
  it("never relocates an existing valid relative link just to change its style", () => {
    const target = write("docs/testing.md", "# Testing\n");
    const file = write("README.md", "[Testing](docs/testing.md)");
    expect(buildLinkFixPlan([file], root, [target]).changes).toEqual([]);
  });
});
