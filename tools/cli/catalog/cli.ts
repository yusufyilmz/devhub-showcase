import { type CatalogOptions, generateCatalogs } from "./catalogs.ts";

function optionValue(args: string[], index: number, arg: string) {
  const value = args[index];
  if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
  return value;
}

function parseArguments(args: string[], preset?: string): CatalogOptions {
  const options: CatalogOptions = { package: preset };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--") continue;
    if (arg === "--check") {
      options.check = true;
      continue;
    }
    if (arg !== "--package" && arg !== "--root") throw new Error(`Unknown catalog option: ${arg}`);
    const value = optionValue(args, ++index, arg);
    if (arg === "--root") options.root = value;
    else options.package = value;
  }
  if (preset && options.package !== preset) throw new Error(`This alias only supports ${preset}`);
  return options;
}
export function runCatalogCli(args: string[], preset?: string) {
  if (args.includes("--help")) {
    process.stdout.write(
      "Generate workspace CATALOG.md files: [--check] [--package <name>] [--root <path>]\nEdit catalog.template.md for guidance; exports, scripts and dependencies are generated.\n",
    );
    return;
  }
  try {
    const options = parseArguments(args, preset);
    const result = generateCatalogs(options);
    if (options.check && result.stale.length) {
      process.stderr.write(
        `Catalogs out of date: ${result.stale.join(", ")}. Run pnpm generate:catalogs.\n`,
      );
      process.exitCode = 1;
    } else
      process.stdout.write(
        `${options.check ? "Checked" : "Generated"} ${result.packages.length} package catalogs (${result.changed.length} updated).\n`,
      );
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
