import path from "node:path";

import { ArtifactReader } from "./artifacts.ts";
import { LookupError } from "./types.ts";

const usage = "Usage: pnpm lookup <symbol|capability|design> [search terms]";
const readers = {
  capability: "capabilities",
  design: "designs",
  symbol: "symbols",
} as const;

const [kind, ...terms] = process.argv.slice(2);
if (kind === "--help" || kind === "-h") {
  process.stdout.write(`${usage}\n`);
} else if (kind && Object.hasOwn(readers, kind)) {
  try {
    const reader = new ArtifactReader(path.resolve(import.meta.dirname, "../../.."));
    const records = reader[readers[kind as keyof typeof readers]]();
    const query = terms.join(" ").toLowerCase().trim().split(/\s+/);
    const matches = records.filter((record) => {
      const searchable = [
        record.name,
        record.heading,
        record.package,
        record.import,
        record.purpose,
        record.content,
      ]
        .join(" ")
        .toLowerCase();
      return query.every((term) => searchable.includes(term));
    });
    const result = { identity: reader.identity(), matches, unresolved: reader.unresolved };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const detail = error instanceof LookupError ? `${error.code}: ${message}` : message;
    process.stderr.write(`${detail}\n`);
    process.exitCode = 1;
  }
} else {
  process.stderr.write(`${usage}\n`);
  process.exitCode = 1;
}
