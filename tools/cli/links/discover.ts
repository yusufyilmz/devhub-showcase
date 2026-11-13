import fs from "node:fs";
import path from "node:path";

const skipped = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "coverage",
  "storybook-static",
  ".link-fix-backups",
]);

const globMagic = /[*?[\]{}]/;

const DEFAULT_PATTERNS = [
  "**/docs",
  "**/README.md",
  "**/CONTRIBUTING.md",
  "**/SECURITY.md",
  "**/AGENTS.md",
  "**/CLAUDE.md",
];

function withinRoot(root: string, target: string): void {
  const relative = path.relative(root, target);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Docs path leaves target root: ${target}`);
  }
}

/** Absolute matches under root, skipping dependency and build directories. */
export function globPaths(root: string, patterns: string[]): string[] {
  const resolved = fs.realpathSync(root);
  return fs
    .globSync(patterns, { cwd: resolved, exclude: (name) => skipped.has(name) })
    .map((match) => path.resolve(resolved, match))
    .sort();
}

/** Existing docs directories and repository guides used when no paths are given. */
export function defaultDocPaths(root: string): string[] {
  return globPaths(root, DEFAULT_PATTERNS);
}

/**
 * Inputs are files, directories, or globs. Directories are walked recursively.
 * Symlinks are not followed.
 */
export function discoverDocs(rootDir: string, inputs: string[] = []): string[] {
  const root = fs.realpathSync(rootDir);
  const files = new Set<string>();

  function walk(file: string): void {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) return;
    withinRoot(root, fs.realpathSync(file));
    if (stat.isDirectory()) {
      if (skipped.has(path.basename(file))) return;
      for (const name of fs.readdirSync(file).sort()) walk(path.join(file, name));
      return;
    }
    if (stat.isFile() && /\.(md|mdx|skill)$/i.test(file)) files.add(file);
  }

  function expand(input: string): string[] {
    const pattern = input.replace(/\/\*\*$/, "");
    const literal = path.resolve(root, pattern);
    if (fs.existsSync(literal) || !globMagic.test(pattern)) return [literal];
    if (pattern.split(/[\\/]/).includes(".."))
      throw new Error(`Docs path leaves target root: ${input}`);
    const matches = globPaths(root, [pattern]);
    if (!matches.length) throw new Error(`Docs glob matched nothing: ${input}`);
    return matches;
  }

  for (const input of inputs.length ? inputs : ["."]) {
    for (const target of expand(input)) {
      withinRoot(root, target);
      if (!fs.existsSync(target)) throw new Error(`Docs path missing: ${input}`);
      walk(target);
    }
  }
  return [...files].sort();
}
