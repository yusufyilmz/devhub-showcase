import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const script = fileURLToPath(new URL("./mark-task.mjs", import.meta.url));
function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), "create-plan-"));
  mkdirSync(path.join(root, ".agents/plans"), { recursive: true });
  const file = path.join(root, ".agents/plans/sample.md");
  writeFileSync(
    file,
    "# A plan\n\n## Execution checklist\n\n- [ ] **P1.1** Verified feature.\n- [ ] **P1.2** Review.\n\n## Completion evidence\n\n| Task | Verified evidence |\n| --- | --- |\n",
  );
  return { file, root };
}
function run(root, ...arguments_) {
  return spawnSync(process.execPath, [script, ...arguments_], {
    cwd: root,
    encoding: "utf8",
  });
}

describe("mark-task helper", () => {
  it("checks only the requested task and records evidence once", () => {
    const { file, root } = fixture();
    try {
      const arguments_ = [
        ".agents/plans/sample.md",
        "--id",
        "P1.1",
        "--evidence",
        "vitest passed on commit abc123",
      ];
      assert.equal(run(root, ...arguments_).status, 0);
      assert.equal(run(root, ...arguments_).status, 0);
      const result = readFileSync(file, "utf8");
      assert.match(result, /- \[x\] \*\*P1\.1\*\*/);
      assert.match(result, /- \[ \] \*\*P1\.2\*\*/);
      assert.equal(result.split("| P1.1 |").length - 1, 1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses unsupported targets and missing evidence without editing files", () => {
    const { file, root } = fixture();
    try {
      const original = readFileSync(file, "utf8");
      assert.notEqual(run(root, ".agents/plans/sample.md", "--id", "P1.1").status, 0);
      assert.notEqual(
        run(root, ".agents/README.md", "--id", "P1.1", "--evidence", "pass").status,
        0,
      );
      assert.equal(readFileSync(file, "utf8"), original);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses ambiguous duplicate task identifiers", () => {
    const { file, root } = fixture();
    try {
      writeFileSync(file, readFileSync(file, "utf8") + "- [ ] **P1.1** Duplicated.\n");
      assert.notEqual(
        run(root, ".agents/plans/sample.md", "--id", "P1.1", "--evidence", "pass").status,
        0,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
