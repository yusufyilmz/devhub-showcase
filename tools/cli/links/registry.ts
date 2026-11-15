import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { headingAnchors } from "./markdown-links.ts";

export interface DocsRegistryFile {
  contentHash: string;
  path: string;
  slugs: string[];
}

export interface DocsRegistry {
  byBasename: Record<string, string[]>;
  bySuffix: Record<string, string[]>;
  files: Record<string, DocsRegistryFile>;
  root: string;
  skipped: string[];
}

const protectedParts = new Set([".git", "node_modules", ".link-fix-backups"]);

function relativeInside(root: string, file: string): string {
  const name = path.relative(root, file);
  if (!name || name === ".." || name.startsWith(`..${path.sep}`) || path.isAbsolute(name)) {
    throw new Error(`Path escapes root: ${file}`);
  }
  return name;
}

function checkPath(root: string, file: string): void {
  let current = root;
  for (const part of relativeInside(root, file).split(path.sep)) {
    if (protectedParts.has(part)) throw new Error(`Protected path: ${file}`);
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Symlink path: ${file}`);
  }
}

function addIndex(index: Record<string, string[]>, key: string, name: string): void {
  const list = index[key] ?? [];
  list.push(name);
  index[key] = list;
}

function readRegistryFile(root: string, file: string): DocsRegistryFile {
  checkPath(root, file);
  const info = fs.statSync(file);
  if (!info.isFile() || info.nlink !== 1)
    throw new Error(`Not a single-link regular file: ${file}`);
  const content = fs.readFileSync(file, "utf8");
  const name = path.relative(root, file).split(path.sep).join("/");
  return {
    contentHash: createHash("sha256").update(content).digest("hex"),
    path: name,
    slugs: [...headingAnchors(content)].sort(),
  };
}

/** Index selected documents by basename and every path suffix. */
export function buildDocsRegistry(rootDir: string, selectedFiles: string[]): DocsRegistry {
  const root = fs.realpathSync(rootDir);
  const registry: DocsRegistry = { byBasename: {}, bySuffix: {}, files: {}, root, skipped: [] };
  const inputs = [...new Set(selectedFiles.map((file) => path.resolve(root, file)))].sort();
  for (const file of inputs) {
    const name = path.relative(root, file).split(path.sep).join("/");
    try {
      if (!/\.(md|mdx|skill)$/i.test(file)) continue;
      const entry = readRegistryFile(root, file);
      registry.files[name] = entry;
      addIndex(registry.byBasename, path.posix.basename(name), name);
      const parts = name.split("/");
      for (let index = 0; index < parts.length; index += 1) {
        addIndex(registry.bySuffix, parts.slice(index).join("/"), name);
      }
    } catch (error) {
      registry.skipped.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  registry.skipped.sort();
  return registry;
}

/** Longest suffix first. Several equally ranked documents stay ambiguous. */
export function registryCandidates(registry: DocsRegistry, pathname: string): DocsRegistryFile[] {
  const parts = pathname.split("/").filter((part) => part && part !== "." && part !== "..");
  for (let length = parts.length; length > 0; length -= 1) {
    const suffix = parts.slice(-length).join("/");
    const names = length === 1 ? registry.byBasename[suffix] : registry.bySuffix[suffix];
    if (!names?.length) continue;
    return names.flatMap((name) => {
      const file = registry.files[name];
      return file ? [file] : [];
    });
  }
  return [];
}
