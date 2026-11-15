import path from "node:path";

import { Command } from "commander";

import { formatError, setFailure } from "../shared/helpers.ts";
import { logError } from "../shared/logger/log.ts";
import { scaffoldSkill } from "./scaffold.ts";
import { symlinkSkills } from "./symlink.ts";
import { validateSkills } from "./validate.ts";

const program = new Command("skills").description(
  "Scaffold, validate, and link repository skills in .agents/skills",
);

program
  .command("symlink")
  .description("Link .cursor/skills and .claude/skills to .agents/skills")
  .option("--root <path>", "Repository root", process.cwd())
  .option("--dry-run", "Print links without creating them")
  .action((options: { dryRun?: boolean; root: string }) => {
    try {
      const code = symlinkSkills(path.resolve(options.root), options.dryRun ?? false);
      if (code !== 0) setFailure();
    } catch (error) {
      logError(formatError(error));
      setFailure();
    }
  });

program
  .command("validate")
  .description(
    "Check skill frontmatter, advisory file size, placeholders, and local Markdown links",
  )
  .option("--root <path>", "Repository root", process.cwd())
  .option("--fix", "Rewrite skill frontmatter with stable YAML")
  .action((options: { fix?: boolean; root: string }) => {
    try {
      const code = validateSkills(path.resolve(options.root), options.fix ?? false);
      if (code !== 0) setFailure();
    } catch (error) {
      logError(formatError(error));
      setFailure();
    }
  });

program
  .command("scaffold")
  .description("Create a draft skill with SKILL.md, workflows/, and references/")
  .argument("<name>", "Kebab-case skill name")
  .option("-d, --description <text>", "Skill description")
  .option("--root <path>", "Repository root", process.cwd())
  .option("--dry-run", "Print files without writing them")
  .action((name: string, options: { description?: string; dryRun?: boolean; root: string }) => {
    try {
      const code = scaffoldSkill(
        path.resolve(options.root),
        name,
        options.description,
        options.dryRun ?? false,
      );
      if (code !== 0) setFailure();
    } catch (error) {
      logError(formatError(error));
      setFailure();
    }
  });

program.parse();
