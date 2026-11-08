import fs from "node:fs";
import path from "node:path";

import { importPath, parseCatalog } from "./catalog.ts";
import { catalogAudience } from "./catalog-sections.ts";
import { digest, type MarkdownNode, markdown, object, slug, text, versions } from "./markdown.ts";
import { discoverMarkdown, repositorySymbols } from "./repository.ts";
import { LookupError, type LookupRecord } from "./types.ts";

/** Reads only the selected project's artifacts, never the tools bundle or module root. */
export class ArtifactReader {
  readonly root: string;
  readonly inputs = new Map<string, string>();
  private symbolRecords?: LookupRecord[];
  unresolved = 0;
  constructor(root?: string) {
    let selected = root ? path.resolve(root) : process.cwd();
    if (!root) {
      let candidate = selected;
      while (true) {
        if (
          fs.existsSync(path.join(candidate, "pnpm-workspace.yaml")) ||
          fs.existsSync(path.join(candidate, ".ai"))
        ) {
          selected = candidate;
          break;
        }
        const parent = path.dirname(candidate);
        if (parent === candidate) break;
        candidate = parent;
      }
    }
    this.root = fs.realpathSync(selected);
  }
  private inside(candidate: string) {
    const relative = path.relative(this.root, candidate);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  }
  read(file: string): string;
  read(file: string, optional: boolean): string | undefined;
  read(file: string, optional = false): string | undefined {
    const candidate = path.resolve(this.root, file);
    if (!this.inside(candidate))
      throw new LookupError("unsafe_path", "Artifact must remain within the selected project");
    try {
      const resolved = fs.realpathSync(candidate);
      if (!this.inside(resolved) || !fs.statSync(resolved).isFile()) {
        throw new LookupError("unsafe_path", `Unsafe artifact: ${file}`);
      }
      const content = fs.readFileSync(resolved, "utf8").replace(/\r\n/g, "\n");
      this.inputs.set(file, content);
      return content;
    } catch (error) {
      if (["ENOENT", "ENOTDIR"].includes((error as NodeJS.ErrnoException).code ?? "")) {
        if (optional) return undefined;
        throw new LookupError(
          "missing_artifact",
          `Missing ${file} in the selected project; do not generate/install automatically`,
        );
      }
      throw error;
    }
  }
  identity(): string {
    return digest(
      JSON.stringify([this.root, [...this.inputs].sort(([a], [b]) => a.localeCompare(b))]),
    );
  }
  private recordId(kind: string, file: string, content: string, key: string) {
    return `${kind}:${digest(JSON.stringify([file, content, key])).slice(0, 24)}`;
  }
  symbols(): LookupRecord[] {
    if (this.symbolRecords) return this.symbolRecords;
    const file = ".ai/manifest.json";
    const content = this.read(file, true);
    if (content === undefined) {
      if (
        !["apps", "packages", "tools"].some((directory) =>
          fs.existsSync(path.join(this.root, directory)),
        )
      )
        this.read(file);
      this.symbolRecords = repositorySymbols(this);
      return this.symbolRecords;
    }
    const raw: unknown = JSON.parse(content);
    const { original, unresolved, packages } = manifestInventory(raw);
    this.unresolved += unresolved;
    // Reuse the imports reader's compatible normalization and deduplication.
    const parsed = original.size ? parseCatalog(raw) : [];
    const packageVersions = new Map<string, Record<string, string>>();
    for (const pkg of packages) {
      const catalog = this.read(`.ai/catalogs/${pkg.split("/").at(-1)}-catalog.md`, true);
      packageVersions.set(pkg, catalog ? versions(markdown(catalog).metadata, pkg) : {});
    }
    this.symbolRecords = parsed.flatMap((entry) => {
      const source = original.get(
        JSON.stringify([entry.package, entry.subpath, entry.name, entry.kind]),
      );
      if (!source) return [];
      const module = importPath(entry);
      return [
        {
          artifact: file,
          audience: source.audience,
          export: source.export,
          id: this.recordId("symbol", file, content, `${module}:${source.export}`),
          import: module,
          kind: entry.kind,
          package: entry.package,
          subpath: entry.subpath ? `./${entry.subpath}` : ".",
          versions: packageVersions.get(entry.package) ?? {},
        },
      ];
    });
    return this.symbolRecords;
  }
  capabilities(): LookupRecord[] {
    const directory = path.join(this.root, ".ai/catalogs");
    if (!fs.existsSync(directory)) return this.documents("catalog");
    const inventory = this.symbols();
    return discoverMarkdown(this.root, ".ai/catalogs").flatMap((file) =>
      this.capabilityFile(file, inventory),
    );
  }
  private capabilityFile(file: string, inventory: LookupRecord[]): LookupRecord[] {
    const content = this.read(file);
    const { metadata, nodes } = markdown(content);
    const heading = nodes.find((node) => node.type === "heading" && node.depth === 1);
    const pkg = typeof metadata.name === "string" ? metadata.name : text(heading);
    if (!pkg.startsWith("@shared/"))
      throw new LookupError("invalid_schema", `Catalog package heading missing: ${file}`);
    const table = nodes.find(
      (node) => node.type === "table" && text(node.children?.[0]?.children?.[0]) === "Capability",
    );
    if (!table)
      throw new LookupError("invalid_schema", `Compact capability table missing: ${file}`);
    return (table.children ?? []).slice(1).flatMap((row) => {
      const cells = (row.children ?? []).map(text);
      if (cells.length !== 3 || cells.some((cell) => !cell))
        throw new LookupError("invalid_schema", `Invalid capability row: ${file}`);
      const [name, purpose, module] = cells as [string, string, string];
      const owner = inventory.find((record) => record.package === pkg && record.import === module);
      if (!owner) return [];
      return [
        {
          artifact: file,
          audience: owner.audience,
          id: this.recordId("capability", file, content, `${name}:${module}`),
          import: module,
          name,
          package: pkg,
          purpose,
          subpath: owner.subpath,
          versions: versions(metadata, pkg),
        },
      ];
    });
  }
  design(): LookupRecord[] {
    const file = fs.existsSync(path.join(this.root, ".ai/DESIGN.md"))
      ? ".ai/DESIGN.md"
      : "DESIGN.md";
    return this.sections(file, "design");
  }
  documents(kind: "docs" | "skills" | "catalog"): LookupRecord[] {
    const files =
      kind === "catalog"
        ? [
            ...["apps", "packages", "tools"]
              .flatMap((directory) => discoverMarkdown(this.root, directory))
              .filter((file) => file.endsWith("/CATALOG.md")),
            ...discoverMarkdown(this.root, ".ai/catalogs"),
          ]
        : kind === "docs"
          ? discoverMarkdown(this.root, "docs")
          : [".agents/skills", ".ai/skills", ".claude/skills", ".cursor/skills"].flatMap((dir) =>
              discoverMarkdown(this.root, dir),
            );
    return [...new Set(files)]
      .sort()
      .flatMap((file) =>
        kind === "catalog" ? this.catalogRecords(file) : this.sections(file, kind),
      );
  }
  private catalogRecords(file: string): LookupRecord[] {
    const content = this.read(file);
    const { body, nodes, metadata: frontmatter } = markdown(content);
    const manifestFile = `${path.posix.dirname(file)}/package.json`;
    const manifest = this.read(manifestFile, true);
    const metadata = manifest ? JSON.parse(manifest) : frontmatter;
    let heading = file;
    const records: LookupRecord[] = [];
    const facts = catalogFacts(metadata);
    for (const node of nodes) {
      if (node.type === "heading") {
        heading = text(node);
        continue;
      }
      if (["html", "thematicBreak"].includes(node.type)) continue;
      const chunks = node.type === "table" ? (node.children ?? []).slice(1) : [node];
      for (const [index, chunk] of chunks.entries()) {
        records.push({
          artifact: file,
          ...catalogExcerpt(body, node, chunk, heading),
          id: this.recordId("catalog", file, content, `${node.position.start.offset}:${index}`),
          ...facts,
        });
      }
    }
    return records;
  }
  private sections(file: string, kind: string): LookupRecord[] {
    const content = this.read(file);
    const { metadata, body, nodes } = markdown(content);
    const headings = nodes.filter((n) => n.type === "heading" && (n.depth ?? 0) >= 2);
    if (!headings.length) {
      return [
        {
          artifact: file,
          content: body.trim(),
          heading: typeof metadata.name === "string" ? metadata.name : file,
          id: this.recordId(kind, file, content, "whole"),
          versions: versions(metadata),
        },
      ];
    }
    const sections = headings.map((node, index) => ({
      content: body
        .slice(
          node.position.start.offset,
          headings[index + 1]?.position?.start.offset ?? body.length,
        )
        .trim(),
      depth: node.depth ?? 2,
      heading: text(node),
    }));
    const crossCutting = new Set([
      "Visual direction",
      "Interaction states",
      "Do and don't",
      "Consumer workflow",
      "Known gaps",
    ]);
    const constraints = sections.filter((s) => crossCutting.has(s.heading)).map((s) => s.content);
    const preamble = body.slice(0, headings[0]?.position.start.offset ?? 0).trim();
    const packageName = file.match(/^packages\/([^/]+)\//)?.[1];
    const packageMetadata = packageName
      ? this.read(`packages/${packageName}/package.json`, true)
      : undefined;
    const pkg = packageMetadata ? (JSON.parse(packageMetadata).name as string) : undefined;
    const anchors = new Map<string, number>();
    const parents: typeof sections = [];
    return sections.map((section) => {
      while (parents.length && (parents.at(-1)?.depth ?? 0) >= section.depth) parents.pop();
      const prerequisites = parents.map((parent) => parent.content);
      parents.push(section);
      const base = slug(section.heading);
      const duplicate = anchors.get(base) ?? 0;
      anchors.set(base, duplicate + 1);
      return {
        anchor: duplicate ? `${base}-${duplicate}` : base,
        artifact: file,
        constraints: [
          ...new Set([
            preamble,
            ...constraints.filter((c) => c !== section.content),
            ...prerequisites,
          ]),
        ].filter(Boolean),
        ...(typeof metadata.description === "string" ? { purpose: metadata.description } : {}),
        content: section.content,
        heading: section.heading,
        id: this.recordId(kind, file, content, `${section.heading}:${duplicate}`),
        ...(pkg ? { package: pkg } : {}),
        versions: versions(metadata, pkg),
      };
    });
  }
}

type ManifestOwner = { export: string; audience: "UI" | "SERVER" | "SHARED" };
function validateEntry(
  pkg: string,
  subpath: string,
  entry: unknown,
): { exports: string[]; audience?: string } {
  if (
    (subpath !== "." && !subpath.startsWith("./")) ||
    subpath.split("/").includes("..") ||
    !object(entry)
  )
    throw new LookupError("invalid_schema", `Invalid manifest subpath: ${pkg} ${subpath}`);
  if (
    !Array.isArray(entry.exports) ||
    !entry.exports.every((name) => typeof name === "string" && name.trim())
  )
    throw new LookupError("invalid_schema", `Invalid manifest exports: ${pkg} ${subpath}`);
  if (entry.audience !== undefined && !["UI", "SERVER", "SHARED"].includes(String(entry.audience)))
    throw new LookupError("invalid_schema", `Invalid manifest audience: ${pkg} ${subpath}`);
  return entry as { exports: string[]; audience?: string };
}
function manifestInventory(raw: unknown) {
  if (!object(raw))
    throw new LookupError("invalid_schema", "Manifest must be package → subpath → exports");
  const original = new Map<string, ManifestOwner>();
  let unresolved = 0;
  for (const [pkg, subpaths] of Object.entries(raw)) {
    if (!pkg.startsWith("@shared/") || pkg.includes("..") || !object(subpaths))
      throw new LookupError("invalid_schema", `Invalid manifest package: ${pkg}`);
    for (const [subpath, rawEntry] of Object.entries(subpaths)) {
      const entry = validateEntry(pkg, subpath, rawEntry);
      unresolved += registerExports(pkg, subpath, entry, original);
    }
  }
  return { original, packages: Object.keys(raw), unresolved };
}
function unresolvedExport(subpath: string, exported: string): boolean {
  return subpath.includes("*") || exported.includes("*") || /^namespace\s/.test(exported);
}
function catalogFacts(
  metadata: Record<string, unknown>,
): Pick<LookupRecord, "package" | "audience" | "versions"> {
  if (typeof metadata.name !== "string") return { versions: {} };
  return {
    audience: catalogAudience(metadata.name, ".", {}, metadata),
    package: metadata.name,
    versions: versions(metadata, metadata.name),
  };
}
function catalogExcerpt(body: string, node: MarkdownNode, chunk: MarkdownNode, heading: string) {
  const excerpt = body.slice(chunk.position.start.offset, chunk.position.end.offset);
  if (node.type !== "table") return { content: excerpt, heading };
  const header = body.slice(node.position.start.offset, node.children?.[1]?.position.start.offset);
  return {
    content: `${header}${excerpt}`.trim(),
    heading: `${heading}: ${text(chunk.children?.[0] ?? chunk)}`,
  };
}

function registerExports(
  pkg: string,
  subpath: string,
  entry: { exports: string[]; audience?: string },
  original: Map<string, ManifestOwner>,
): number {
  const audience = catalogAudience(pkg, subpath, entry);
  let unresolved = 0;
  for (const exported of entry.exports) {
    if (unresolvedExport(subpath, exported)) {
      unresolved++;
      continue;
    }
    const key = JSON.stringify([
      pkg,
      subpath === "." ? "" : subpath.slice(2),
      exported.replace(/^type\s+/, "").trim(),
      /^type\s/.test(exported) ? "type" : "value",
    ]);
    original.set(key, { audience, export: exported });
  }
  return unresolved;
}
