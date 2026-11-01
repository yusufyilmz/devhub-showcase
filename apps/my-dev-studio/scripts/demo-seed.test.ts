import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

describe("DemoSeed", () => {
  it("runs guarded demo provisioning tests without external services", () => {
    const output = execFileSync(
      process.execPath,
      ["--test", "--test-reporter=tap", "apps/my-dev-studio/scripts/seed-demo.test.mjs"],
      {
        encoding: "utf8",
      },
    );
    expect(output).toContain("# fail 0");
  });
});
