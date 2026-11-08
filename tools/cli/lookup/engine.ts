import { ArtifactReader } from "./artifacts.ts";
import { serializeLookup } from "./output.ts";
import {
  LookupError,
  type LookupKind,
  type LookupOptions,
  type LookupOutput,
  type LookupRecord,
} from "./types.ts";

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
function key(record: LookupRecord): string {
  return [
    record.package,
    record.subpath,
    record.export,
    record.heading,
    record.name,
    record.id,
  ].join("\0");
}
function filtered(records: LookupRecord[], options: LookupOptions): LookupRecord[] {
  return records.filter(
    (record) =>
      (!options.package ||
        record.package === options.package ||
        !!record.versions[options.package]) &&
      (!options.audience || record.audience === options.audience),
  );
}
/** Lexical AND matching. Name/heading phrase 20, each title term 5, each body term 1. */
function ranked(records: LookupRecord[], query: string): LookupRecord[] {
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return records
    .map((record) => {
      const title = (record.name ?? record.heading ?? "").toLowerCase();
      const body = [
        record.purpose,
        record.content,
        record.package,
        record.audience,
        record.artifact,
        record.import,
        record.export,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const score =
        terms.length && terms.every((term) => `${title} ${body}`.includes(term))
          ? (title.includes(query.toLowerCase()) ? 20 : 0) +
            terms.reduce((sum, term) => sum + (title.includes(term) ? 5 : 1), 0)
          : 0;
      return { record, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || compare(key(a.record), key(b.record)))
    .map((entry) => entry.record);
}
function validate(kind: LookupKind, query: string, options: LookupOptions) {
  if (!query) throw new LookupError("invalid_argument", "A nonempty query/section id is required");
  for (const value of [options.limit ?? 5, options.maxTokens ?? 1500]) {
    if (!Number.isSafeInteger(value) || value <= 0)
      throw new LookupError(
        "invalid_argument",
        "Limit and max-tokens must be positive safe integers",
      );
  }
  if (options.format && !["json", "text"].includes(options.format))
    throw new LookupError("invalid_argument", "Format must be json or text");
  if (options.audience && !["UI", "SERVER", "SHARED"].includes(options.audience))
    throw new LookupError("invalid_argument", "Audience must be UI, SERVER or SHARED");
  if (kind === "section" && options.cursor)
    throw new LookupError("invalid_argument", "Section retrieval does not accept a cursor");
}
function inventory(reader: ArtifactReader, kind: Exclude<LookupKind, "section">): LookupRecord[] {
  switch (kind) {
    case "symbol":
      return reader.symbols();
    case "capability":
      return reader.capabilities();
    case "design":
      return reader.design();
    default:
      return reader.documents(kind);
  }
}
function section(reader: ArtifactReader, query: string, options: LookupOptions): LookupRecord[] {
  if (!/^(design|capability|symbol|docs|skills|catalog):[a-f0-9]{24}$/.test(query))
    throw new LookupError(
      "invalid_section",
      "Use an id from a current lookup result, never a file path",
    );
  const kind = query.split(":")[0] as Exclude<LookupKind, "section">;
  const records = filtered(inventory(reader, kind), options).filter(
    (record) => record.id === query,
  );
  if (!records.length)
    throw new LookupError(
      "invalid_section",
      "Section id is stale or outside the selected artifacts/filters; repeat the original query",
    );
  return records;
}
function search(reader: ArtifactReader, kind: LookupKind, query: string, options: LookupOptions) {
  if (kind === "section") return { records: section(reader, query, options) };
  const items = filtered(inventory(reader, kind), options);
  if (kind === "symbol") {
    items.sort((a, b) => compare(key(a), key(b)));
    const symbol = query.replace(/^type\s+/, "");
    const name = (record: LookupRecord) => (record.export ?? "").replace(/^type\s+/, "").trim();
    const records = items.filter((record) => name(record) === symbol);
    const suggestions = records.length
      ? undefined
      : [...new Set(items.map(name))]
          .filter(
            (item) =>
              item.toLowerCase().includes(symbol.toLowerCase()) ||
              symbol.toLowerCase().includes(item.toLowerCase()),
          )
          .sort(compare)
          .slice(0, options.limit ?? 5);
    return { records, suggestions };
  }
  const records = ranked(items, query);
  if (kind !== "design") return { records };
  return {
    records: records.filter(
      (record, index) =>
        !records
          .slice(0, index)
          .some((previous) => record.content && previous.constraints?.includes(record.content)),
    ),
  };
}
function errorOutput(error: unknown, options: LookupOptions): LookupOutput {
  let code = "artifact_read_error";
  if (error instanceof LookupError) code = error.code;
  else if (
    error instanceof SyntaxError ||
    (error instanceof Error && error.name.startsWith("YAML"))
  )
    code = "invalid_schema";
  const budget = options.maxTokens ?? 1500;
  return serializeLookup(
    [],
    {
      ...options,
      cursor: undefined,
      maxTokens: Number.isSafeInteger(budget) && budget > 0 ? budget : 1500,
    },
    {
      error: { code, message: error instanceof Error ? error.message : String(error) },
      identity: "error",
      status: "error",
    },
  );
}
function lookup(kind: LookupKind, input: string, supplied: LookupOptions = {}): LookupOutput {
  const options = {
    ...supplied,
    maxTokens: supplied.maxTokens ?? (["symbol", "capability"].includes(kind) ? 1500 : 2500),
  };
  try {
    const query = input.trim();
    validate(kind, query, options);
    const reader = new ArtifactReader(options.root);
    const { records, suggestions } = search(reader, kind, query, options);
    return serializeLookup(records, options, {
      identity: JSON.stringify([
        "lookup-v2-lexical-and",
        kind,
        query,
        options.package,
        options.audience,
        reader.identity(),
      ]),
      status: kind === "symbol" && records.length > 1 ? "ambiguous" : undefined,
      suggestions,
      unresolved: kind === "symbol" ? reader.unresolved : undefined,
    });
  } catch (error) {
    return errorOutput(error, options);
  }
}
export function findSymbol(query: string, options?: LookupOptions): LookupOutput {
  return lookup("symbol", query, options);
}
export function searchCapabilities(query: string, options?: LookupOptions): LookupOutput {
  return lookup("capability", query, options);
}
export function searchDesign(query: string, options?: LookupOptions): LookupOutput {
  return lookup("design", query, options);
}
export function getArtifactSection(id: string, options?: LookupOptions): LookupOutput {
  return lookup("section", id, options);
}

export function searchDocs(query: string, options?: LookupOptions): LookupOutput {
  return lookup("docs", query, options);
}

export function searchSkills(query: string, options?: LookupOptions): LookupOutput {
  return lookup("skills", query, options);
}

export function searchCatalog(query: string, options?: LookupOptions): LookupOutput {
  return lookup("catalog", query, options);
}
