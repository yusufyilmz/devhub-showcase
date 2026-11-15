import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as yamlLoad } from "yaml";

import type { CatalogAudience, LookupRecord } from "./types.ts";
import { LookupError } from "./types.ts";

const parser = unified().use(remarkParse).use(remarkGfm);

interface MarkdownNode {
  children?: MarkdownNode[];
  depth?: number;
  position?: {
    start: { offset?: number };
    end: { offset?: number };
  };
  type: string;
  value?: string;
}

interface Section {
  content: string;
  depth: number;
  heading: string;
  start: number;
}

type ManifestEntry = {
  exports: string[];
  audience?: CatalogAudience;
};
type SymbolManifest = Record<string, Record<string, ManifestEntry>>;

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAudience(value: unknown): value is CatalogAudience {
  return value === "UI" || value === "SERVER" || value === "SHARED";
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function text(node: MarkdownNode): string {
  return node.value ?? (node.children ?? []).map(text).join("");
}

/** Accepts frontmatter delimited by --- (with normalized LF line endings). */
export function markdown(content: string): {
  metadata: Record<string, unknown>;
  body: string;
  nodes: MarkdownNode[];
} {
  let body = content.replace(/\r\n?/g, "\n");
  let metadata: Record<string, unknown> = {};
  if (body.startsWith("---\n")) {
    const end = body.indexOf("\n---\n", 4);
    if (end < 0) {
      throw new LookupError("invalid_schema", "Unclosed artifact frontmatter");
    }
    const parsed: unknown = yamlLoad(body.slice(4, end));
    if (!object(parsed)) {
      throw new LookupError("invalid_schema", "Artifact frontmatter must be a mapping");
    }
    metadata = parsed;
    body = body.slice(end + 5);
  }
  const tree = parser.parse(body) as MarkdownNode;
  return { body, metadata, nodes: tree.children ?? [] };
}

function parseSections(body: string, nodes: MarkdownNode[], maxDepth = 6): Section[] {
  const headings = nodes.flatMap((node) => {
    const depth = node.depth;
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (
      node.type !== "heading" ||
      depth === undefined ||
      depth > maxDepth ||
      start === undefined ||
      end === undefined
    ) {
      return [];
    }
    return [{ depth, end, heading: text(node).trim(), start }];
  });
  return headings.map((heading, index) => ({
    content: body.slice(heading.end, headings[index + 1]?.start ?? body.length).trim(),
    depth: heading.depth,
    heading: heading.heading,
    start: heading.start,
  }));
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function versions(metadata: Record<string, unknown>, pkg?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (pkg && typeof metadata.version === "string") result[pkg] = metadata.version;
  if (object(metadata.packages)) {
    for (const [name, value] of Object.entries(metadata.packages)) {
      if (typeof value === "string") result[name] = value;
    }
  }
  return result;
}

function parseManifestEntry(pkg: string, subpath: string, raw: unknown): ManifestEntry {
  if (
    (subpath !== "." && !subpath.startsWith("./")) ||
    subpath.split("/").includes("..") ||
    !object(raw) ||
    !Array.isArray(raw.exports) ||
    !raw.exports.every((name) => typeof name === "string" && name.trim())
  ) {
    throw new LookupError("invalid_schema", `Invalid manifest subpath/exports: ${pkg} ${subpath}`);
  }
  const audience = raw.audience;
  if (audience !== undefined && !isAudience(audience)) {
    throw new LookupError("invalid_schema", `Invalid manifest audience: ${pkg} ${subpath}`);
  }
  return { audience, exports: raw.exports as string[] };
}

/** Reads a YAML/JSON catalog from Markdown (frontmatter or a fenced data block). */
function parseSymbolManifest(content: string): SymbolManifest {
  const { metadata, body } = markdown(content);
  const block = body.match(/```(?:yaml|yml|json)\s*\n([\s\S]*?)\n```/i)?.[1];
  const mapping = [metadata.catalog, metadata.manifest, metadata.packages].find(object);
  const source: unknown = mapping ?? (block === undefined ? metadata : yamlLoad(block));
  if (!object(source)) throw new LookupError("invalid_schema", "Missing symbol catalog mapping");
  return Object.fromEntries(
    Object.entries(source).map(([pkg, subpaths]) => {
      if (!/^(@[\w.-]+\/)?[\w.-]+$/.test(pkg) || pkg === "." || pkg === ".." || !object(subpaths)) {
        throw new LookupError("invalid_schema", `Invalid catalog package: ${pkg}`);
      }
      const entries = Object.entries(subpaths).map(([subpath, raw]) => [
        subpath,
        parseManifestEntry(pkg, subpath, raw),
      ]);
      return [pkg, Object.fromEntries(entries)];
    }),
  );
}

export class ArtifactReader {
  readonly root: string;
  readonly inputs = new Map<string, string>();
  unresolved = 0;
  private symbolRecords?: LookupRecord[];

  constructor(root = process.cwd()) {
    // A symlinked workspace itself is fine; paths inside it are checked below.
    this.root = fs.realpathSync(path.resolve(root));
  }

  private inside(candidate: string): boolean {
    const relative = path.relative(this.root, candidate);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  }

  /** Read only an existing regular file inside the selected project, following symlinks safely. */
  read(file: string, optional = false): string | undefined {
    const candidate = path.resolve(this.root, file);
    if (!this.inside(candidate)) {
      throw new LookupError("unsafe_path", `Artifact must remain within selected project: ${file}`);
    }
    let resolved: string;
    try {
      resolved = fs.realpathSync(candidate);
      if (!this.inside(resolved) || !fs.statSync(resolved).isFile()) {
        throw new LookupError("unsafe_path", `Unsafe artifact path: ${file}`);
      }
      const content = fs.readFileSync(resolved, "utf8").replace(/\r\n?/g, "\n");
      this.inputs.set(file.replaceAll("\\", "/"), content);
      return content;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        if (optional) return undefined;
        throw new LookupError("missing_artifact", `Missing ${file} in the selected project`);
      }
      throw error;
    }
  }

  /** Stable over the root path and normalized Markdown used by a lookup. */
  identity(): string {
    return digest(
      JSON.stringify([this.root, [...this.inputs].sort(([a], [b]) => a.localeCompare(b))]),
    );
  }

  private recordId(args: { kind: string; file: string; content: string; key: string }): string {
    return digest(JSON.stringify([args.kind, args.file, digest(args.content), args.key])).slice(
      0,
      24,
    );
  }

  /** Enumerate .md files recursively while refusing traversal through symlinks. */
  private markdownFiles(directory: string): string[] {
    const base = path.resolve(this.root, directory);
    if (!this.inside(base) || !fs.existsSync(base)) return [];
    if (!this.inside(fs.realpathSync(base))) {
      throw new LookupError("unsafe_path", `Unsafe artifact directory: ${directory}`);
    }
    const results: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolute = path.join(dir, entry.name);
        // Skip symlink entries entirely; prevents recursive loops and escapes.
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) walk(absolute);
        else if (entry.isFile() && entry.name.endsWith(".md")) {
          results.push(path.relative(this.root, absolute).split(path.sep).join("/"));
        }
      }
    };
    walk(base);
    return results.sort();
  }

  /** Exact public imports from .ai/catalogs/symbols-catalog.md. */
  symbols(): LookupRecord[] {
    if (this.symbolRecords) return this.symbolRecords;
    const file = ".ai/catalogs/symbols-catalog.md";
    const content = this.read(file);
    if (content === undefined) return [];
    const manifest = parseSymbolManifest(content);
    this.symbolRecords = Object.entries(manifest).flatMap(([pkg, subpaths]) =>
      Object.entries(subpaths).flatMap(([subpath, entry]) => {
        const importPath = subpath === "." ? pkg : `${pkg}/${subpath.slice(2)}`;
        return entry.exports.flatMap((exported): LookupRecord[] => {
          const name = exported.replace(/^type\s+/, "");
          if (subpath.includes("*") || !/^[A-Za-z_$][\w$]*$/.test(name)) {
            this.unresolved++;
            return [];
          }
          return [
            {
              artifact: file,
              audience: entry.audience ?? "SHARED",
              export: exported,
              id: this.recordId({
                content,
                file,
                key: `${importPath}:${exported}`,
                kind: "symbol",
              }),
              import: importPath,
              kind: exported.startsWith("type ") ? "type" : "value",
              name,
              package: pkg,
              subpath,
            },
          ];
        });
      }),
    );
    return this.symbolRecords;
  }

  private packageCatalogs(): string[] {
    const directory = path.join(this.root, "packages");
    if (!fs.existsSync(directory)) return [];
    if (!this.inside(fs.realpathSync(directory))) {
      throw new LookupError("unsafe_path", "Unsafe artifact directory: packages");
    }
    return fs
      .readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `packages/${entry.name}/CATALOG.md`)
      .filter((file) => fs.existsSync(path.join(this.root, file)))
      .sort();
  }

  /** Capability documentation, indexed at heading boundaries. */
  capabilities(): LookupRecord[] {
    const files = this.markdownFiles(".ai/catalogs").filter(
      (file) => file !== ".ai/catalogs/symbols-catalog.md",
    );
    const catalogs = files.length ? files : this.packageCatalogs();
    if (!catalogs.length) throw new LookupError("missing_artifact", "Missing capability catalogs");
    const records: LookupRecord[] = [];
    for (const file of catalogs) {
      const content = this.read(file);
      if (content === undefined) continue;
      const parsed = markdown(content);
      const sections = parseSections(parsed.body, parsed.nodes, 2);
      const { audience, package: pkg, purpose } = parsed.metadata;
      const packageName = typeof pkg === "string" ? pkg : undefined;
      records.push(
        ...sections.map((section) => {
          const heading = section.heading;
          return {
            anchor: slug(heading),
            artifact: file,
            audience: isAudience(audience) ? audience : undefined,
            content: section.content,
            heading,
            id: this.recordId({
              content,
              file,
              key: `${heading}:${section.start}`,
              kind: "capability",
            }),
            name: heading,
            package: packageName,
            purpose: typeof purpose === "string" ? purpose : undefined,
            versions: versions(parsed.metadata, packageName),
          };
        }),
      );
    }
    return records;
  }

  /** Design documentation with inherited cross-cutting constraints. */
  designs(): LookupRecord[] {
    const files = new Set([
      ...this.markdownFiles(".ai/design"),
      ...this.markdownFiles(".ai/designs"),
      ...this.markdownFiles(".ai/catalogs").filter((file) => /design/i.test(file)),
    ]);
    if (!files.size) files.add("DESIGN.md");
    const records: LookupRecord[] = [];
    for (const file of [...files].sort()) {
      const content = this.read(file);
      if (content === undefined) continue;
      const { metadata, body, nodes } = markdown(content);
      const sections = parseSections(body, nodes);
      const crosscutting = new Set([
        "visual direction",
        "interaction states",
        "do and don't",
        "consumer workflow",
        "known gaps",
      ]);
      const constraints = sections
        .filter((section) => crosscutting.has(section.heading.toLowerCase()))
        .map((section) => section.content)
        .filter(Boolean);
      const headingNodes = nodes.filter((n) => n.type === "heading");
      const preamble = body.slice(0, headingNodes[0]?.position?.start.offset ?? body.length).trim();
      const anchors = new Map<string, number>();
      let parent: Section | undefined;
      records.push(
        ...sections.map((section) => {
          if (section.depth < 3) parent = section.depth === 2 ? section : undefined;
          const base = slug(section.heading);
          const duplicate = anchors.get(base) ?? 0;
          anchors.set(base, duplicate + 1);
          return {
            anchor: duplicate ? `${base}-${duplicate}` : base,
            artifact: file,
            constraints: [
              ...new Set([
                preamble,
                ...constraints.filter((value) => value !== section.content),
                ...(section.depth === 3 && parent ? [parent.content] : []),
              ]),
            ].filter(Boolean),
            content: section.content,
            heading: section.heading,
            id: this.recordId({
              content,
              file,
              key: `${section.heading}:${duplicate}`,
              kind: "design",
            }),
            versions: versions(metadata),
          };
        }),
      );
    }
    return records;
  }
}
