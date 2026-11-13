import path from "node:path";

import { Command } from "commander";

import { formatError, setFailure } from "../shared/helpers.ts";
import { logError } from "../shared/logger/log.ts";
import { reportLinks } from "./check.ts";

interface CheckLinksCommandOptions {
  dryRun?: boolean;
  external?: boolean;
  fix?: boolean;
  paths?: string[];
  root?: string;
}

const program = new Command("check-links")
  .description("Validate Markdown links. --fix repairs unambiguous missing local documents")
  .option("--root <path>", "Project root", process.cwd())
  .option("--paths <paths...>", "Files, directories, or globs to check within --root")
  .option("--no-external", "Check local links only")
  .option("--fix", "Repair unambiguous missing local Markdown links")
  .option("--dry-run", "Preview repairs without writing (requires --fix)")
  .action(async (options: CheckLinksCommandOptions) => {
    try {
      const code = await reportLinks({
        dryRun: options.dryRun,
        external: options.external !== false,
        fix: options.fix,
        paths: options.paths,
        root: path.resolve(options.root ?? process.cwd()),
      });
      if (code !== 0) setFailure();
    } catch (error) {
      logError(formatError(error));
      setFailure();
    }
  });

program.parse();
