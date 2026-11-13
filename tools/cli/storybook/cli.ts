import { Command } from "commander";

import { formatError, setFailure } from "../shared/helpers.ts";
import { logError } from "../shared/logger/index.ts";
import { runRewriteMdTitles } from "./rewrite-titles.ts";

type RewriteTitlesCommandOptions = {
  cwd?: string;
  dryRun?: boolean;
  verbose?: boolean;
};

/**
 * `storybook:rewrite-titles` — Synchronize CSF story and MDX titles from filesystem paths
 */
export function makeRewriteTitlesCommand(): Command {
  return new Command("rewrite-titles")
    .description("Rewrite CSF and MDX titles inline as string literals matching folder layout")
    .option("--cwd <path>", "Target working directory", process.cwd())
    .option("--dry-run", "Print changes without modifying files")
    .option("-v, --verbose", "Log detailed file operations")
    .action(async (options: RewriteTitlesCommandOptions) => {
      try {
        await runRewriteMdTitles({
          cwd: options.cwd,
          dryRun: options.dryRun ?? false,
          verbose: options.verbose ?? false,
        });
      } catch (error) {
        logError(formatError(error));
        setFailure();
      }
    });
}

const program = new Command("storybook")
  .description("Storybook scaffolding, story variant generation, and asset tooling.")
  .addCommand(makeRewriteTitlesCommand())
  .configureHelp({
    sortSubcommands: true, // Groups: create:*, fix:*, generate:*, rewrite:*
  });

program.parse();
