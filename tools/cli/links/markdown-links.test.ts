import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { headingAnchors, validateLocalLinks } from "./markdown-links.ts";

let root: string;
beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "links-")));
});
afterEach(() => fs.rmSync(root, { force: true, recursive: true }));
const write = (name: string, content: string) => {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
};
describe("offline local links", () => {
  it("checks heading-only links and duplicate heading suffixes", () => {
    const file = write("guide.md", "# Hello\n# Hello\n[ok](#hello-1)\n[bad](#missing)\n");
    const issues = validateLocalLinks([file], root);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("#missing");
  });
  it("checks referenced and shortcut links including missing definitions", () => {
    write("target.md", "# Target\n");
    const file = write("guide.md", "[one][ref]\n[ref]\n[bad][absent]\n[ref]: target.md#target\n");
    const issues = validateLocalLinks([file], root);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("definition is missing");
  });
  it("handles encoded names and balanced parentheses, and ignores code examples", () => {
    write("a (b).md", "# Hello\n");
    const file = write(
      "guide.md",
      "[one](<a%20(b).md#hello>)\n`[bad](missing.md)`\n```md\n[bad](missing.md)\n```\n",
    );
    expect(validateLocalLinks([file], root)).toEqual([]);
  });
  it("checks images and rejects traversal and malformed encoding", () => {
    const file = write("guide.md", "![x](missing.png)\n[x](../../outside.md)\n[x](%zz.md)\n");
    expect(validateLocalLinks([file], root)).toHaveLength(3);
  });
  it("does not perform external HTTP validation", () => {
    const file = write("guide.md", "[remote](https://example.invalid/#missing)\n");
    expect(validateLocalLinks([file], root)).toEqual([]);
  });
  it("rejects local symlinks pointing outside the selected root", () => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "outside-"));
    try {
      fs.writeFileSync(path.join(outside, "x.md"), "# x");
      fs.symlinkSync(path.join(outside, "x.md"), path.join(root, "x.md"));
      expect(validateLocalLinks([write("guide.md", "[x](x.md)")], root)[0]?.message).toContain(
        "escapes",
      );
    } finally {
      fs.rmSync(outside, { force: true, recursive: true });
    }
  });
  it("includes explicit HTML and Setext heading anchors", () => {
    const ids = headingAnchors('Heading\n=======\n<a id="explicit"></a>\n');
    expect(ids.has("heading")).toBe(true);
    expect(ids.has("explicit")).toBe(true);
  });
});
