import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "yaml";

import { ArtifactReader } from "../lookup/artifacts.ts";
import { repositorySymbols } from "../lookup/repository.ts";
import type { LookupRecord } from "../lookup/types.ts";
import { catalogQuery, catalogTitle, packageGuidance, renderHbs } from "./render-hbs.ts";
import { code, table } from "./table.ts";
import { renderUiCatalogMarkers } from "./ui-registry.mjs";

export interface CatalogOptions {
  check?: boolean;
  package?: string;
  root?: string;
}
export interface CatalogResult {
  changed: string[];
  packages: string[];
  stale: string[];
}
interface Manifest {
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  exports?: unknown;
  main?: string;
  name: string;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}
interface WorkspacePackage {
  directory: string;
  manifest: Manifest;
  relative: string;
}
const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const header =
  "<!-- Generated from tools/cli/catalog/templates/package.md.hbs, package.json and declared public exports. Run pnpm generate:catalogs. -->\n\n";
const reference =
  "\n\n## Generated package reference\n\n<!-- catalog:exports -->\n\n<!-- catalog:scripts -->\n\n<!-- catalog:dependencies -->\n";
const packageTemplatePath = fileURLToPath(new URL("./templates/package.md.hbs", import.meta.url));
function sharedCatalogSource(pkg: WorkspacePackage, existing: string | undefined): string {
  const depth = pkg.relative.split(/[\\/]/).filter(Boolean).length;
  const rootPrefix = "../".repeat(depth);
  const guidance = packageGuidance(existing);
  const renderedGuidance =
    pkg.manifest.name === "@shared/ui"
      ? guidance.replace(
          /^\| Attribute +\| Values +\|\n(?:\|[^\n]*\n)*?\| Portfolio accents [^\n]*\n/m,
          "<!-- registry:theme-options -->\n",
        )
      : guidance;
  return renderHbs(fs.readFileSync(packageTemplatePath, "utf8"), {
    agentsReadme: `${rootPrefix}.agents/README.md`,
    cliReadme: `${rootPrefix}tools/cli/README.md#token-bounded-repository-lookup`,
    guidance: renderedGuidance,
    name: pkg.manifest.name,
    query: catalogQuery(pkg.manifest.name, existing),
    title: catalogTitle(pkg.manifest.name, existing),
  }).replace(/\r\n/g, "\n");
}
function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function compare(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function inside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function safePath(root: string, target: string) {
  if (!inside(root, fs.realpathSync(path.dirname(target))))
    throw new Error(`Unsafe catalog path: ${target}`);
  try {
    if (fs.lstatSync(target).isSymbolicLink())
      throw new Error(`Symlinked catalog input/output: ${target}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
function workspacePatterns(root: string): string[] {
  const raw: unknown = parse(fs.readFileSync(path.join(root, "pnpm-workspace.yaml"), "utf8"));
  if (
    !object(raw) ||
    !Array.isArray(raw.packages) ||
    !raw.packages.every((pattern) => typeof pattern === "string")
  )
    throw new Error("Workspace packages must be a list of glob patterns");
  return raw.packages as string[];
}
function globManifests(root: string, pattern: string): string[] {
  if (path.isAbsolute(pattern) || pattern.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe workspace pattern: ${pattern}`);
  return fs.globSync(`${pattern.replace(/\/$/, "")}/package.json`, { cwd: root }).sort(compare);
}
function discover(root: string): WorkspacePackage[] {
  const patterns = workspacePatterns(root);
  const excluded = new Set(
    patterns
      .filter((pattern) => pattern.startsWith("!"))
      .flatMap((pattern) => globManifests(root, pattern.slice(1))),
  );
  const manifests = [
    ...new Set(
      patterns
        .filter((pattern) => !pattern.startsWith("!"))
        .flatMap((pattern) => globManifests(root, pattern)),
    ),
  ]
    .filter((file) => !excluded.has(file))
    .sort(compare);
  const names = new Set<string>();
  return manifests.map((file) => {
    const target = path.join(root, file);
    safePath(root, target);
    const manifest = JSON.parse(fs.readFileSync(target, "utf8")) as Manifest;
    if (typeof manifest.name !== "string" || names.has(manifest.name))
      throw new Error(`Missing or duplicate package name: ${file}`);
    names.add(manifest.name);
    return {
      directory: path.dirname(target),
      manifest,
      relative: path.dirname(file).replaceAll(path.sep, "/"),
    };
  });
}
function targets(value: unknown, condition = ""): string[] {
  if (value === null) return [];
  if (typeof value === "string") return [condition ? `${condition}: ${value}` : value];
  if (Array.isArray(value))
    return value.flatMap((entry, index) => targets(entry, `${condition}[${index}]`));
  if (!object(value)) throw new Error("Export targets must be strings, conditions, arrays or null");
  return Object.entries(value)
    .sort(([a], [b]) => compare(a, b))
    .flatMap(([key, entry]) => targets(entry, condition ? `${condition}/${key}` : key));
}
function exportEntries(manifest: Manifest): [string, unknown][] {
  const value = manifest.exports;
  if (value === undefined) return manifest.main ? [[".", manifest.main]] : [];
  if (object(value) && Object.keys(value).some((key) => key.startsWith(".")))
    return Object.entries(value).sort(([a], [b]) => compare(a, b));
  return [[".", value]];
}
function renderExports(manifest: Manifest, symbols: LookupRecord[]): string {
  const rows = exportEntries(manifest).flatMap(([subpath, target]) => {
    const sources = targets(target);
    if (!sources.length) return [];
    const module =
      subpath === "." ? manifest.name : `${manifest.name}/${subpath.replace(/^\.\//, "")}`;
    const names = [
      ...new Set(
        symbols
          .filter((record) => record.import === module)
          .flatMap((record) => (record.export ? [record.export] : [])),
      ),
    ].sort(compare);
    return [
      [code(module), sources.map(code).join(", "), names.length ? names.map(code).join(", ") : "—"],
    ];
  });
  if (!rows.length) return "No public package export map or main entry is declared.";
  return `${table(["Import", "Source / condition", "Declared symbols"], rows)}\n\nSymbol names are read statically from TypeScript declarations without executing their implementation modules. Wildcard package paths, external star re-exports and non-code assets are not expanded into symbol claims. Verify source contracts before importing.`;
}
function renderScripts(manifest: Manifest): string {
  const rows = Object.entries(manifest.scripts ?? {})
    .sort(([a], [b]) => compare(a, b))
    .map(([name, command]) => [code(name), code(command)]);
  return rows.length ? table(["Script", "Command"], rows) : "No package scripts are declared.";
}
function renderDependencies(manifest: Manifest): string {
  const groups = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ] as const;
  const rows = groups.flatMap((group) =>
    Object.entries(manifest[group] ?? {})
      .sort(([a], [b]) => compare(a, b))
      .map(([name, version]) => [code(name), code(version), group]),
  );
  return rows.length
    ? table(["Dependency", "Declared version", "Kind"], rows)
    : "No package dependencies are declared.";
}
function withReference(source: string): string {
  const normalized = source.replace(/\r\n/g, "\n");
  if (normalized.includes("<!-- catalog:")) return normalized;
  return normalized.trimEnd() + reference;
}
function sourceTemplate(root: string, pkg: WorkspacePackage) {
  const templatePath = path.join(pkg.directory, "catalog.template.md");
  const catalogPath = path.join(pkg.directory, "CATALOG.md");
  safePath(root, templatePath);
  safePath(root, catalogPath);
  if (fs.existsSync(templatePath)) {
    return {
      catalogPath,
      shared: false,
      source: withReference(fs.readFileSync(templatePath, "utf8")),
      templatePath,
    };
  }
  if (fs.existsSync(catalogPath)) {
    const existing = fs.readFileSync(catalogPath, "utf8");
    if (!existing.startsWith(header) && !existing.startsWith("<!-- Generated from ")) {
      return {
        catalogPath,
        shared: false,
        source: withReference(existing.replace(/^<!-- Generated[\s\S]*?-->\n+/, "")),
        templatePath,
      };
    }
    return {
      catalogPath,
      shared: true,
      source: sharedCatalogSource(pkg, existing),
      templatePath,
    };
  }
  return { catalogPath, shared: true, source: sharedCatalogSource(pkg, undefined), templatePath };
}
function renderTemplate(source: string, pkg: WorkspacePackage, symbols: LookupRecord[]): string {
  const replacements: Record<string, () => string> = {
    dependencies: () => renderDependencies(pkg.manifest),
    exports: () => renderExports(pkg.manifest, symbols),
    package: () => code(pkg.manifest.name),
    scripts: () => renderScripts(pkg.manifest),
  };
  let rendered = source.replace(/<!-- catalog:([\w-]+) -->/g, (_marker, name: string) => {
    const render = replacements[name];
    if (!render) throw new Error(`Unknown catalog marker ${name} in ${pkg.relative}`);
    return render();
  });
  if (rendered.includes("<!-- registry:")) {
    if (pkg.manifest.name !== "@shared/ui")
      throw new Error(`Registry markers are only supported in @shared/ui: ${pkg.relative}`);
    rendered = renderUiCatalogMarkers(rendered);
  }
  if (/<!--\s*(?:catalog|registry):/.test(rendered))
    throw new Error(`Malformed or unresolved catalog marker in ${pkg.relative}`);
  return `${header}${rendered.trimEnd()}\n`;
}
function same(file: string, content: string) {
  return fs.existsSync(file) && fs.readFileSync(file, "utf8") === content;
}
function catalogIsCurrent(plan: {
  catalogPath: string;
  rendered: string;
  shared: boolean;
  source: string;
  templatePath: string;
}): boolean {
  return (
    same(plan.catalogPath, plan.rendered) && (plan.shared || same(plan.templatePath, plan.source))
  );
}
/** All plans are validated before writing. Check mode never creates or changes files. */
export function generateCatalogs(options: CatalogOptions = {}): CatalogResult {
  const root = fs.realpathSync(options.root ?? repositoryRoot);
  const packages = discover(root).filter(
    (pkg) => !options.package || pkg.manifest.name === options.package,
  );
  if (options.package && !packages.length)
    throw new Error(`Unknown workspace package: ${options.package}`);
  const symbols = packages.length
    ? repositorySymbols(
        new ArtifactReader(root),
        packages.map((pkg) => pkg.relative),
      )
    : [];
  const plans = packages.map((pkg) => {
    const template = sourceTemplate(root, pkg);
    return {
      ...template,
      pkg,
      rendered: renderTemplate(
        template.source,
        pkg,
        symbols.filter((symbol) => symbol.package === pkg.manifest.name),
      ),
    };
  });
  const result: CatalogResult = {
    changed: [],
    packages: packages.map((pkg) => pkg.manifest.name),
    stale: [],
  };
  for (const plan of plans) {
    if (catalogIsCurrent(plan)) continue;
    result.stale.push(plan.pkg.relative);
    if (options.check) continue;
    if (!plan.shared && !same(plan.templatePath, plan.source)) {
      fs.writeFileSync(plan.templatePath, plan.source);
    }
    if (!same(plan.catalogPath, plan.rendered)) fs.writeFileSync(plan.catalogPath, plan.rendered);
    result.changed.push(plan.pkg.relative);
  }
  return result;
}
