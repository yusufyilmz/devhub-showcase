/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: scripts */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const workspaceRoots = ["apps", "packages", "tools"];

const errors = [];

function fail(message) {
  errors.push(message);
  console.error(message);
}

function isConditionMap(value) {
  return Object.keys(value).every((key) => !key.startsWith("."));
}

function collectTargets(value, targets, label) {
  if (value === null) return;
  if (typeof value === "string") {
    targets.push(value);
    return;
  }
  if (Array.isArray(value) || typeof value !== "object") {
    fail(`${label} must be a string, null, or condition object`);
    return;
  }
  for (const nested of Object.values(value)) {
    collectTargets(nested, targets, label);
  }
}

function starCount(value) {
  return value.match(/\*/g)?.length ?? 0;
}

function assertExportKey(specifier) {
  if (specifier === "." || specifier.startsWith("./")) return;
  fail(`Export key must start with "." : ${specifier}`);
}

function assertTarget(target) {
  if (target.startsWith("./") && !target.includes("..")) return;
  fail(`Export target must be a relative file inside the package: ${target}`);
}

async function expandWildcard(packageDir, relativeTarget) {
  const parts = relativeTarget.split("/");
  const matches = [];

  async function visit(current, index) {
    if (index === parts.length) {
      matches.push(current);
      return;
    }

    const part = parts[index];
    if (!part.includes("*")) {
      await visit(path.join(current, part), index + 1);
      return;
    }

    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    const pattern = new RegExp(
      `^${part
        .split("*")
        .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("[^/]*")}$`,
    );

    for (const entry of entries) {
      if (!pattern.test(entry.name)) continue;
      await visit(path.join(current, entry.name), index + 1);
    }
  }

  await visit(packageDir, 0);
  return matches;
}

async function targetExists(packageDir, target) {
  const relative = target.slice(2);
  if (!relative.includes("*")) {
    try {
      return (await stat(path.join(packageDir, relative))).isFile();
    } catch {
      return false;
    }
  }

  const matches = await expandWildcard(packageDir, relative);
  const files = await Promise.all(
    matches.map(async (file) => {
      try {
        return (await stat(file)).isFile();
      } catch {
        return false;
      }
    }),
  );
  return files.some(Boolean);
}

async function checkPackage(packageJsonPath) {
  const packageDir = path.dirname(packageJsonPath);
  const manifest = JSON.parse(await readFile(packageJsonPath, "utf8"));
  if (manifest.exports == null) return;

  const name = manifest.name ?? path.relative(root, packageDir);
  const exportsField = manifest.exports;
  const entries =
    typeof exportsField === "string" ? [[".", exportsField]] : Object.entries(exportsField);

  for (const [specifier, value] of entries) {
    assertExportKey(specifier);
    const targets = [];
    const label = `${name} ${specifier}`;
    if (typeof value === "object" && value && !Array.isArray(value) && !isConditionMap(value)) {
      fail(`${label} must use condition names for nested targets`);
    }
    collectTargets(value, targets, label);
    if (targets.length === 0 && value !== null) {
      fail(`${name} ${specifier} does not point at a file`);
    }
    for (const target of targets) {
      assertTarget(target);
      if (starCount(specifier) !== starCount(target)) {
        fail(`${name} ${specifier} -> ${target} has a different number of "*" wildcards`);
      }
      if (!(await targetExists(packageDir, target))) {
        const detail = target.includes("*") ? "matched no files" : "is missing";
        fail(`${name} ${specifier} -> ${target} ${detail}`);
      }
    }
  }

  if (!errors.some((error) => error.startsWith(`${name} `) || error.includes(`${name}:`))) {
    console.log(`✓ ${name}`);
  }
}

async function packageJsonFiles() {
  const files = [];
  for (const workspaceRoot of workspaceRoots) {
    let entries;
    try {
      entries = await readdir(path.join(root, workspaceRoot), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const packageJsonPath = path.join(root, workspaceRoot, entry.name, "package.json");
      try {
        await stat(packageJsonPath);
        files.push(packageJsonPath);
      } catch {
        // Workspace globs can include directories without a package.
      }
    }
  }
  return files;
}

for (const packageJsonPath of await packageJsonFiles()) {
  await checkPackage(packageJsonPath);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} package export ${errors.length === 1 ? "error" : "errors"}`);
  process.exitCode = 1;
}
