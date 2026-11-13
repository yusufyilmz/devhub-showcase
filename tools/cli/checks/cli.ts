import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { setFailure } from "../shared/helpers.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

const checks = {
  catalogs: [
    "node",
    [
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "tools/cli/scripts/generate-catalogs.mjs",
      "--check",
    ],
  ],
  complexity: [
    "pnpm",
    [
      "exec",
      "biome",
      "check",
      "--only=complexity/noExcessiveCognitiveComplexity",
      "--error-on-warnings",
      ".",
    ],
  ],
  docs: ["pnpm", ["exec", "markdownlint-cli2", "**/*.md"]],
  exports: ["node", ["tools/cli/scripts/check-exports.mjs"]],
  links: ["node", ["tools/cli/links/cli.ts", "--no-external"]],
  lint: ["pnpm", ["exec", "biome", "check", "."]],
  secrets: ["node", ["tools/cli/checks/secrets.ts"]],
  skills: ["node", ["tools/cli/skills/cli.ts", "validate"]],
  types: ["pnpm", ["run", "typecheck"]],
  unused: ["pnpm", ["exec", "knip", "--max-show-issues", "5"]],
} as const;

function runCheck(command: string, args: readonly string[], extra: string[]): number {
  const result = spawnSync(command, [...args, ...extra], { cwd: repoRoot, stdio: "inherit" });
  return result.status ?? 1;
}

const program = new Command("check").description(
  "Repository checks rewritten for MyDevStudio and My Fitness Studio",
);

for (const [name, [command, args]] of Object.entries(checks)) {
  program
    .command(name)
    .description(`Run check:${name}`)
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .action((_options, cmd: Command) => {
      const code = runCheck(command, args, cmd.args);
      if (code !== 0) setFailure();
    });
}

program.parse();
