// Compatibility alias: the UI uses the same workspace catalog pipeline.
import { runCatalogCli } from "../catalog/cli.ts";

runCatalogCli(process.argv.slice(2), "@shared/ui");
