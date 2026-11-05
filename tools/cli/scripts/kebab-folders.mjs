#!/usr/bin/env node

/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: scripts */

/**
 * Rename every directory under a root to kebab-case and rewrite relative
 * imports that point at those directories.
 *
 * Files inside those directories stay as they are. `Button/Button.tsx` becomes
 * `button/Button.tsx`.
 *
 * Usage:
 *   node tools/cli/scripts/kebab-folders.mjs <directory> [--dry-run] [--search <dir>]
 *   node tools/cli/scripts/kebab-folders.mjs --root <directory> [--dry-run] [--search <dir>]
 */

import fs from "node:fs";
import path from "node:path";

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
]);

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".js",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
]);

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function printHelp() {
  console.log(`Usage: node tools/cli/scripts/kebab-folders.mjs <directory> [--dry-run] [--search <dir>]
       node tools/cli/scripts/kebab-folders.mjs --root <directory> [--dry-run] [--search <dir>]

<directory>  Folder whose child directories are renamed to kebab-case.
--search     Where to rewrite relative imports. Defaults to the repository root.
--dry-run    Print renames and import edits without writing them.`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    root: "",
    search: findRepoRoot(process.cwd()),
  };
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      positionals.push(path.resolve(arg));
      index += 1;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--root") {
      options.root = path.resolve(argv[index + 1] ?? "");
      index += 1;
    } else if (arg === "--search") {
      options.search = path.resolve(argv[index + 1] ?? "");
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      positionals.push(path.resolve(arg));
    }
  }

  if (positionals.length > 1) {
    throw new Error(`Expected one directory, received ${positionals.length}`);
  }
  if (options.root && positionals.length === 1) {
    throw new Error("Pass the directory either as an argument or with --root, not both");
  }

  options.root = options.root || positionals[0] || "";
  if (!options.root) {
    printHelp();
    process.exit(1);
  }

  return options;
}

function findRepoRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, "pnpm-workspace.yaml"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(start);
    current = parent;
  }
}

function walkDirectories(root) {
  const found = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(directory, entry.name);
      found.push(full);
      visit(full);
    }
  }
  visit(root);
  return found;
}

function walkFiles(root) {
  const found = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(full);
      } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
        found.push(full);
      }
    }
  }
  visit(root);
  return found;
}

function planRenames(directories) {
  const plans = [];
  const taken = new Map(
    directories.map((directory) => [
      path.join(path.dirname(directory), path.basename(directory).toLowerCase()),
      directory,
    ]),
  );

  for (const directory of directories) {
    const currentName = path.basename(directory);
    const nextName = toKebab(currentName);
    if (currentName === nextName) continue;

    const parent = path.dirname(directory);
    const destination = path.join(parent, nextName);
    const key = destination.toLowerCase();
    const previous = taken.get(key);
    if (previous && previous !== directory) {
      throw new Error(
        `Kebab-case collision: ${previous} and ${directory} both become ${destination}`,
      );
    }
    taken.set(key, directory);
    plans.push({ destination, directory, nextName });
  }

  plans.sort((left, right) => right.directory.length - left.directory.length);
  return plans;
}

function rewriteSpecifier(specifier, fromFile, renamedDirectories) {
  if (!specifier.startsWith(".")) return specifier;

  const parts = specifier.split("/");
  let current = path.dirname(fromFile);
  const next = [];
  let changed = false;

  for (const part of parts) {
    if (part === "." || part === "..") {
      current = path.resolve(current, part);
      next.push(part);
      continue;
    }

    const joined = path.resolve(current, part);
    const renamed = renamedDirectories.get(joined);
    if (renamed) {
      next.push(renamed);
      changed = true;
    } else {
      next.push(part);
    }
    current = joined;
  }

  return changed ? next.join("/") : specifier;
}

function rewriteComponentsPath(relativePath, relativeNames) {
  let oldRelative = "";
  const next = [];

  for (const segment of relativePath.split("/")) {
    oldRelative = oldRelative ? `${oldRelative}/${segment}` : segment;
    next.push(relativeNames.get(oldRelative) ?? segment);
  }

  return next.join("/");
}

function rootPathPrefixes(root, search) {
  const relative = path.relative(search, root).split(path.sep).join("/");
  const prefixes = [relative];
  const packagesIndex = relative.indexOf("packages/");
  if (packagesIndex > 0) prefixes.push(relative.slice(packagesIndex));
  return prefixes.filter(Boolean).sort((left, right) => right.length - left.length);
}

function rewriteRootPaths(source, prefixes, relativeNames) {
  let next = source;

  for (const prefix of prefixes) {
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(${escaped}/)([A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*)`, "g");
    next = next.replace(pattern, (match, lead, relativePath) => {
      const rewritten = rewriteComponentsPath(relativePath, relativeNames);
      return rewritten === relativePath ? match : `${lead}${rewritten}`;
    });
  }

  return next;
}

function rewriteFile(file, renamedDirectories, relativeNames, prefixes) {
  const source = fs.readFileSync(file, "utf8");
  let next = source;

  next = next.replace(
    /((?:from|import)\s*(?:\(\s*)?['"])(\.[^'"]+)(['"])/g,
    (match, prefix, specifier, suffix) => {
      const rewritten = rewriteSpecifier(specifier, file, renamedDirectories);
      return rewritten === specifier ? match : `${prefix}${rewritten}${suffix}`;
    },
  );

  next = next.replace(/(\]\()(\.[^)\s]+)(\))/g, (match, prefix, specifier, suffix) => {
    const rewritten = rewriteSpecifier(specifier, file, renamedDirectories);
    return rewritten === specifier ? match : `${prefix}${rewritten}${suffix}`;
  });

  next = rewriteRootPaths(next, prefixes, relativeNames);

  return next === source ? null : next;
}

function renameDirectory(directory, destination) {
  const parent = path.dirname(directory);
  const caseOnly =
    parent === path.dirname(destination) &&
    path.basename(directory).toLowerCase() === path.basename(destination).toLowerCase();

  if (caseOnly) {
    const temporary = path.join(parent, `.${path.basename(directory)}.kebab-tmp`);
    fs.renameSync(directory, temporary);
    fs.renameSync(temporary, destination);
    return;
  }

  fs.renameSync(directory, destination);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(options.root)) {
    throw new Error(`Root does not exist: ${options.root}`);
  }

  const plans = planRenames(walkDirectories(options.root));
  const renamedDirectories = new Map(plans.map((plan) => [plan.directory, plan.nextName]));
  const relativeNames = new Map(
    plans.map((plan) => [path.relative(options.root, plan.directory), plan.nextName]),
  );
  const prefixes = rootPathPrefixes(options.root, options.search);
  const files = walkFiles(options.search).filter((file) => file !== path.resolve(process.argv[1]));
  const edits = [];

  for (const file of files) {
    const next = rewriteFile(file, renamedDirectories, relativeNames, prefixes);
    if (next != null) edits.push({ file, next });
  }

  console.log(`${options.dryRun ? "Would rename" : "Renaming"} ${plans.length} directories`);
  for (const plan of plans) {
    console.log(`  ${path.relative(options.root, plan.directory)} -> ${plan.nextName}`);
  }
  console.log(`${options.dryRun ? "Would update" : "Updating"} ${edits.length} files`);

  if (options.dryRun) return;

  for (const edit of edits) fs.writeFileSync(edit.file, edit.next);
  for (const plan of plans) renameDirectory(plan.directory, plan.destination);
}

main();
