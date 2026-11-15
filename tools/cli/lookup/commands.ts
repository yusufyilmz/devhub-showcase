import { Command, Option } from "commander";

import {
  findSymbol,
  getArtifactSection,
  searchCapabilities,
  searchCatalog,
  searchDesign,
  searchDocs,
  searchSkills,
} from "./engine.ts";
import type { LookupOptions } from "./types.ts";

export function makeLookupCommands(): Command[] {
  return (
    [
      ["docs", searchDocs, "Search repository documentation sections"],
      ["skills", searchSkills, "Search skill instructions and references"],
      ["catalog", searchCatalog, "Search package catalog sections"],
      ["symbol", findSymbol, "Find every exact public symbol owner/subpath"],
      [
        "capability",
        searchCapabilities,
        "Rank compact capability rows with verified public imports",
      ],
      ["design", searchDesign, "Rank complete design sections with cross-cutting constraints"],
      [
        "section",
        getArtifactSection,
        "Retrieve a complete record/section from a current result id",
      ],
    ] as const
  ).map(([kind, helper, description]) => {
    const command = new Command(kind)
      .alias(`lookup:${kind}`)
      .description(`Read-only: ${description}`)
      .argument(
        kind === "section" ? "<id>" : "<query>",
        kind === "section"
          ? "Opaque id from a prior lookup result"
          : "Exact symbol or deterministic lexical query",
      )
      .option(
        "--root <path>",
        "Selected project root (default: resolved from cwd, never tools installation)",
      )
      .option("--package <name>", "Exact package owner or contributing design package")
      .option(
        "--max-tokens <number>",
        "Final stdout budget using js-tiktoken 1.0.21 cl100k_base; encoding-specific estimate",
        Number,
        ["design", "docs", "skills", "catalog", "section"].includes(kind) ? 2500 : 1500,
      )
      .addOption(
        new Option("--format <format>", "Output format; diagnostics always on stderr")
          .choices(["json", "text"])
          .default("json"),
      )
      .addHelpText(
        "after",
        "\nExit codes: 0 match (including ambiguity), 1 Commander syntax/option error, 2 artifact/validated-argument/cursor error, 3 no match, 4 budget too small.\nNo generation, installation, builds or network access. Continue/refine incomplete results; verify props/behavior in matching package exports/declarations.\nIf even the error envelope cannot fit, stdout is empty and stderr explains the budget failure.\n",
      );
    if (kind !== "section")
      command
        .option("--limit <number>", "Maximum complete results per page", Number, 5)
        .option(
          "--cursor <cursor>",
          "Continue the same query/filter/artifact snapshot; limit and budget may change",
        );
    if (kind === "symbol" || kind === "capability")
      command.addOption(
        new Option("--audience <audience>", "Established catalog audience filter").choices([
          "UI",
          "SERVER",
          "SHARED",
        ]),
      );
    return command.action((query: string, options: LookupOptions) => {
      const output = helper(query, options);
      if (output.stdout) process.stdout.write(output.stdout);
      if (output.diagnostic) process.stderr.write(`${output.diagnostic}\n`);
      process.exitCode = output.exitCode;
    });
  });
}
