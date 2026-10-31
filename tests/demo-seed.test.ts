import { execFileSync } from "node:child_process";

import { expect, it } from "vitest";

it("runs guarded demo provisioning tests without external services", () => {
  const output = execFileSync(
    process.execPath,
    ["--test", "--test-reporter=tap", "apps/web/scripts/seed-demo.test.mjs"],
    {
      encoding: "utf8",
    },
  );
  expect(output).toContain("# fail 0");
});
