export type CatalogEntry = {
  kind: "type" | "value";
  name: string;
  package: string;
  subpath: string;
  preferred?: boolean;
};

export function importPath(entry: Pick<CatalogEntry, "package" | "subpath">): string {
  const subpath = entry.subpath.replace(/^\.\//, "").replace(/^\//, "");
  return subpath && subpath !== "." ? `${entry.package}/${subpath}` : entry.package;
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function normalize(raw: Record<string, unknown>): CatalogEntry[] {
  const { name, package: pkg, subpath, kind, preferred } = raw;
  if (typeof name !== "string" || typeof pkg !== "string" || name === "*") return [];
  const normalized =
    typeof subpath === "string" ? subpath.replace(/^\.\//, "").replace(/^\//, "") : "";
  if (pkg.includes("..") || normalized.split("/").includes(".."))
    throw new Error("Unsafe catalog module path");
  return [
    {
      kind: kind === "type" ? "type" : "value",
      name,
      package: pkg,
      subpath: normalized === "." ? "" : normalized,
      ...(preferred === true ? { preferred: true } : {}),
    },
  ];
}
function packageEntries(pkg: string, value: unknown): CatalogEntry[] {
  if (!pkg.startsWith("@shared/")) return [];
  const metadata = object(value);
  const entries: CatalogEntry[] = [];
  for (const [subpath, entry] of Object.entries(object(metadata.exports ?? metadata))) {
    const names = Array.isArray(entry) ? entry : object(entry).exports;
    if (!Array.isArray(names)) continue;
    for (const name of names) {
      if (typeof name !== "string") continue;
      entries.push(
        ...normalize({
          kind: name.startsWith("type ") ? "type" : "value",
          name: name.replace(/^type\s+/, "").trim(),
          package: pkg,
          subpath,
        }),
      );
    }
  }
  return entries;
}
/** Supports symbol arrays and package → subpath → export-name catalogs. */
export function parseCatalog(raw: unknown): CatalogEntry[] {
  const manifest = object(raw);
  const entries = Array.isArray(manifest.symbols)
    ? manifest.symbols.flatMap((entry) => normalize(object(entry)))
    : [];
  for (const [pkg, value] of Object.entries(
    object(manifest.packages ?? manifest.exports ?? manifest),
  ))
    entries.push(...packageEntries(pkg, value));
  const unique = new Map<string, CatalogEntry>();
  for (const entry of entries) {
    const key = JSON.stringify([entry.name, entry.kind, entry.package, entry.subpath]);
    if (!unique.has(key) || entry.preferred) unique.set(key, entry);
  }
  if (!unique.size) throw new Error("Manifest contains no supported exported symbols");
  return [...unique.values()];
}
