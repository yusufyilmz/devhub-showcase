import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./scaffold-agent.mjs", import.meta.url));
const options = [
  "--description",
  "Review server authorization flows. Use on auth PR changes.",
  "--mission",
  "Find concrete tenant isolation regressions and return evidence.",
  "--scope",
  "apps/my-dev-studio/services/admin",
];

function run(root, ...args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

describe("scaffold-agent", () => {
  it("creates one read-only Claude agent and refuses overwrite", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "create-subagent-"));
    try {
      assert.equal(run(root, "access-reviewer", ...options).status, 0);
      const file = path.join(root, ".claude/agents/access-reviewer.md");
      const original = readFileSync(file, "utf8");
      assert.match(original, /^---\nname: access-reviewer/m);
      assert.match(original, /tools: Read, Grep, Glob\n/);
      assert.doesNotMatch(original, /tools:.*Bash/);
      assert.notEqual(run(root, "access-reviewer", ...options).status, 0);
      assert.equal(readFileSync(file, "utf8"), original);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("requires explicit implementation mode for write tools", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "create-subagent-"));
    try {
      assert.equal(
        run(root, "focused-implementer", ...options, "--mode", "implementation").status,
        0,
      );
      const file = readFileSync(path.join(root, ".claude/agents/focused-implementer.md"), "utf8");
      assert.match(file, /tools: Read, Grep, Glob, Edit, Write, Bash/);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("rejects unsafe names and scope traversal", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "create-subagent-"));
    try {
      assert.notEqual(run(root, "../unsafe", ...options).status, 0);
      assert.notEqual(
        run(
          root,
          "unsafe-scope",
          "--description",
          "Review server authorization flows.",
          "--mission",
          "Find concrete authorization regressions.",
          "--scope",
          "../private",
        ).status,
        0,
      );
      assert.notEqual(
        run(root, "empty-mission", "--description", "Review server authorization flows.").status,
        0,
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });
});
