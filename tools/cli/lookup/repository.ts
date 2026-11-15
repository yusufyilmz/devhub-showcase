import fs from "node:fs";
import path from "node:path";

import { parse } from "@babel/parser";

import { digest } from "./markdown.ts";

interface ArtifactReader {
  identity(): string;
  read(file: string, optional?: boolean): string | undefined;
  root: string;
  unresolved: number;
}

import { SKIP_DIR_NAMES } from "./artifact-paths.ts";
import { catalogAudience } from "./catalog-sections.ts";
import { LookupError, type LookupRecord } from "./types.ts";

/** Never follows directory symlinks; file symlinks are checked by ArtifactReader. */
export function discoverMarkdown(root: string, directory: string): string[] {
  const result: string[] = [];
  function walk(relative: string) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) return;
    if (fs.lstatSync(absolute).isSymbolicLink()) {
      throw new LookupError("unsafe_path", `Symlinked artifact directory: ${relative}`);
    }
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const file = `${relative}/${entry.name}`;
      if (entry.isDirectory() && !SKIP_DIR_NAMES.has(entry.name)) walk(file);
      else if (/\.mdx?$/i.test(entry.name)) result.push(file);
    }
  }
  walk(directory);
  return result.sort();
}

function exportTarget(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const conditions = value as Record<string, unknown>;
  for (const key of ["types", "import", "default", "require"]) {
    const target = exportTarget(conditions[key]);
    if (target) return target;
  }
}

function localModule(reader: ArtifactReader, file: string, specifier: string): string | undefined {
  if (!specifier.startsWith(".")) return;
  const base = path.posix.join(path.posix.dirname(file), specifier).replace(/\.js$/, "");
  return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`].find(
    (candidate) => /\.[cm]?[jt]sx?$/.test(candidate) && reader.read(candidate, true) !== undefined,
  );
}

interface SyntaxNode {
  argument?: SyntaxNode;
  declaration?: SyntaxNode;
  declarations?: { id: SyntaxNode }[];
  elements?: (SyntaxNode | null)[];
  exported?: SyntaxNode;
  exportKind?: string;
  id?: SyntaxNode;
  local?: SyntaxNode;
  name?: string;
  properties?: SyntaxNode[];
  source?: SyntaxNode;
  specifiers?: SyntaxNode[];
  type: string;
  value?: string;
}
function declarationNames(node: SyntaxNode): string[] {
  if (node.type === "Identifier") return node.name ? [node.name] : [];
  if (node.id) return declarationNames(node.id);
  if (node.declarations) return node.declarations.flatMap((entry) => declarationNames(entry.id));
  if (node.type === "ObjectPattern") return (node.properties ?? []).flatMap(declarationNames);
  if (node.type === "ArrayPattern")
    return (node.elements ?? []).flatMap((entry) => (entry ? declarationNames(entry) : []));
  if (node.argument) return declarationNames(node.argument);
  if (node.value && typeof node.value === "object") return declarationNames(node.value);
  return [];
}

/** Static syntax inventory: never imports project modules or executes their side effects. */
function sourceExports(
  reader: ArtifactReader,
  file: string,
  visiting = new Set<string>(),
): string[] {
  if (visiting.has(file)) {
    reader.unresolved++;
    return [];
  }
  const content = reader.read(file, true);
  if (content === undefined) {
    reader.unresolved++;
    return [];
  }
  const next = new Set(visiting).add(file);
  const plugins = /\.(?:[cm]jsx|jsx|[cm]tsx|tsx)$/.test(file)
    ? (["typescript", "jsx"] as const)
    : (["typescript"] as const);
  const nodes = parse(content, { plugins: [...plugins], sourceType: "module" }).program
    .body as unknown as SyntaxNode[];
  const result: string[] = [];
  const types = new Set(
    nodes.flatMap((node) => {
      const declaration = node.declaration ?? node;
      return ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"].includes(declaration.type)
        ? declarationNames(declaration)
        : [];
    }),
  );
  for (const node of nodes) result.push(...nodeExports(reader, file, node, next, types));
  return [...new Set(result)].sort();
}

function nodeExports(
  reader: ArtifactReader,
  file: string,
  node: SyntaxNode,
  visiting: Set<string>,
  types: Set<string>,
): string[] {
  if (node.type === "ExportDefaultDeclaration") return ["default"];
  if (node.type === "ExportAllDeclaration") return allExports(reader, file, node, visiting);
  if (node.type !== "ExportNamedDeclaration") return [];
  if (node.declaration) {
    const typeOnly = ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"].includes(
      node.declaration.type,
    );
    return declarationNames(node.declaration).map((name) => `${typeOnly ? "type " : ""}${name}`);
  }
  return namedExports(reader, file, node, visiting, types);
}
function allExports(
  reader: ArtifactReader,
  file: string,
  node: SyntaxNode,
  visiting: Set<string>,
): string[] {
  const resolved = node.source?.value ? localModule(reader, file, node.source.value) : undefined;
  if (!resolved) {
    reader.unresolved++;
    return [];
  }
  return sourceExports(reader, resolved, visiting)
    .filter((name) => name !== "default")
    .map((name) =>
      node.exportKind === "type" && !name.startsWith("type ") ? `type ${name}` : name,
    );
}
function namedExports(
  reader: ArtifactReader,
  file: string,
  node: SyntaxNode,
  visiting: Set<string>,
  localTypes: Set<string>,
): string[] {
  const resolved = node.source?.value ? localModule(reader, file, node.source.value) : undefined;
  const declarations = resolved ? sourceExports(reader, resolved, visiting) : [];
  const types = node.source
    ? new Set(declarations.filter((name) => name.startsWith("type ")).map((name) => name.slice(5)))
    : localTypes;
  return (node.specifiers ?? []).flatMap((entry) => {
    const name = entry.exported?.name ?? entry.exported?.value;
    if (!name) return [];
    const original = entry.local?.name ?? "";
    const typeOnly =
      node.exportKind === "type" || entry.exportKind === "type" || types.has(original);
    return [`${typeOnly ? "type " : ""}${name}`];
  });
}
interface PackageMetadata {
  exports?: Record<string, unknown>;
  name: string;
  version?: string;
}
function entryRecords(
  reader: ArtifactReader,
  metadata: PackageMetadata,
  folder: string,
  subpath: string,
  target: unknown,
): LookupRecord[] {
  const source = exportTarget(target);
  if (!source || !/\.[cm]?[jt]sx?$/.test(source) || subpath.includes("*")) {
    reader.unresolved++;
    return [];
  }
  const file = path.posix.join(folder, source);
  const symbols = sourceExports(reader, file);
  const snapshot = reader.identity();
  return symbols.map((exported) => ({
    artifact: file,
    audience: catalogAudience(
      metadata.name,
      subpath,
      {},
      metadata as unknown as Record<string, unknown>,
    ),
    export: exported,
    id: `symbol:${digest(JSON.stringify([snapshot, metadata.name, subpath, exported])).slice(0, 24)}`,
    import: subpath === "." ? metadata.name : `${metadata.name}/${subpath.slice(2)}`,
    kind: exported.startsWith("type ") ? "type" : "value",
    package: metadata.name,
    subpath,
    versions: metadata.version ? { [metadata.name]: metadata.version } : {},
  }));
}
function workspaceDirectories(reader: ArtifactReader): string[] {
  return ["apps", "packages", "tools"]
    .flatMap((root) => {
      const directory = path.join(reader.root, root);
      if (!fs.existsSync(directory)) return [];
      return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `${root}/${entry.name}`);
    })
    .sort();
}
export function repositorySymbols(reader: ArtifactReader, selected?: string[]): LookupRecord[] {
  const folders = selected ?? workspaceDirectories(reader);
  if (!folders.length)
    throw new LookupError("missing_artifact", "No .ai/manifest.json or workspace packages found");
  const records: LookupRecord[] = [];
  for (const folder of folders) {
    const content = reader.read(`${folder}/package.json`, true);
    if (!content) continue;
    const metadata = JSON.parse(content) as PackageMetadata;
    if (typeof metadata.name !== "string" || (!selected && !metadata.name.startsWith("@shared/")))
      continue;
    for (const [subpath, target] of Object.entries(metadata.exports ?? {}))
      records.push(...entryRecords(reader, metadata, folder, subpath, target));
  }
  return records;
}
