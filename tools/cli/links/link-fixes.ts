import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { extractLinkDestinations } from "./markdown-links.ts";
import { buildDocsRegistry, type DocsRegistryFile, registryCandidates } from "./registry.ts";

interface LinkEdit {
  from: string;
  line: number;
  missingTarget: string;
  target: string;
  targetHash: string;
  to: string;
}

interface LinkChange {
  after: string;
  before: string;
  file: string;
  links: LinkEdit[];
}

export interface LinkFixPlan {
  changes: LinkChange[];
  registry: { anchors: number; documents: number };
  root: string;
  skipped: string[];
}

const protectedParts = new Set([".git", "node_modules", ".link-fix-backups"]);

function hash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function relative(root: string, file: string): string {
  return path.relative(root, file).split(path.sep).join("/");
}

function contained(root: string, file: string): boolean {
  const name = path.relative(root, file);
  return (
    name !== "" && name !== ".." && !name.startsWith(`..${path.sep}`) && !path.isAbsolute(name)
  );
}

function safeFile(root: string, file: string): string {
  const resolved = path.resolve(root, file);
  if (!contained(root, resolved)) throw new Error(`Path escapes root: ${file}`);
  let cursor = root;
  for (const part of path.relative(root, resolved).split(path.sep)) {
    if (protectedParts.has(part)) throw new Error(`Protected path: ${file}`);
    cursor = path.join(cursor, part);
    if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Symlink path: ${file}`);
  }
  const stat = fs.statSync(resolved);
  if (!stat.isFile() || stat.nlink !== 1)
    throw new Error(`Not a single-link regular file: ${file}`);
  return resolved;
}

function readUtf8(file: string): string {
  const bytes = fs.readFileSync(file);
  const text = bytes.toString("utf8");
  if (bytes.includes(0) || !Buffer.from(text, "utf8").equals(bytes)) {
    throw new Error(`Not a UTF-8 document: ${file}`);
  }
  return text;
}

function decodeLocalDocument(
  url: string,
): { fragment: string; pathname: string; suffix: string } | undefined {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url) || /[{}]/.test(url)) return undefined;
  const separator = url.search(/[?#]/);
  const raw = separator < 0 ? url : url.slice(0, separator);
  const suffix = separator < 0 ? "" : url.slice(separator);
  const hashIndex = url.indexOf("#");
  try {
    const pathname = decodeURIComponent(raw).replace(/\\([()[\] ])/g, "$1");
    if (!pathname || pathname.includes("\0") || !/\.(md|mdx|skill)$/i.test(pathname))
      return undefined;
    return {
      fragment: hashIndex < 0 ? "" : decodeURIComponent(url.slice(hashIndex + 1)),
      pathname,
      suffix,
    };
  } catch {
    return undefined;
  }
}

function replacementPath(root: string, target: string): string {
  if (!contained(root, target)) throw new Error(`Path escapes root: ${target}`);
  const encoded = relative(root, target)
    .split("/")
    .map((part) =>
      encodeURIComponent(part).replace(
        /[!'()*]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
      ),
    )
    .join("/");
  return `/${encoded}`;
}

function plannedEdit(
  root: string,
  before: string,
  link: { end: number; index: number; start: number; url: string },
  entry: DocsRegistryFile,
  parsed: { fragment: string; suffix: string },
  missingTarget: string,
): { edit: { end: number; start: number; text: string }; link: LinkEdit } | string {
  if (parsed.fragment && !entry.slugs.includes(parsed.fragment)) {
    return `${link.url}: candidate lacks anchor #${parsed.fragment}`;
  }
  const target = safeFile(root, entry.path);
  const to = replacementPath(root, target) + parsed.suffix;
  return {
    edit: { end: link.end, start: link.start, text: to },
    link: {
      from: link.url,
      line: before.slice(0, link.index).split("\n").length,
      missingTarget,
      target: relative(root, target),
      targetHash: entry.contentHash,
      to,
    },
  };
}

function collectEdit(
  root: string,
  file: string,
  name: string,
  before: string,
  link: { end: number; index: number; start: number; url: string },
  registry: ReturnType<typeof buildDocsRegistry>,
): { edit?: { end: number; start: number; text: string }; link?: LinkEdit; skip?: string } {
  const parsed = decodeLocalDocument(link.url);
  if (!parsed) return {};
  const missing = path.resolve(
    parsed.pathname.startsWith("/") ? root : path.dirname(file),
    parsed.pathname.startsWith("/") ? `.${parsed.pathname}` : parsed.pathname,
  );
  if (!contained(root, missing)) return { skip: `${name}: ${link.url}: target escapes root` };
  if (fs.existsSync(missing)) return {};
  const matches = registryCandidates(registry, parsed.pathname);
  const entry = matches.length === 1 ? matches[0] : undefined;
  if (!entry) {
    const detail = matches.length
      ? `ambiguous (${matches.map((item) => item.path).join(", ")})`
      : "no matching document";
    return { skip: `${name}: ${link.url}: ${detail}` };
  }
  const planned = plannedEdit(root, before, link, entry, parsed, relative(root, missing));
  if (typeof planned === "string") return planned ? { skip: `${name}: ${planned}` } : {};
  return planned;
}

function planDocument(
  root: string,
  input: string,
  registry: ReturnType<typeof buildDocsRegistry>,
  plan: LinkFixPlan,
): void {
  const name = relative(root, path.resolve(root, input));
  try {
    const file = safeFile(root, input);
    const before = readUtf8(file);
    const edits: { end: number; start: number; text: string }[] = [];
    const links: LinkEdit[] = [];
    for (const link of extractLinkDestinations(before)) {
      const planned = collectEdit(root, file, name, before, link, registry);
      if (planned.skip) plan.skipped.push(planned.skip);
      if (!planned.edit || !planned.link) continue;
      edits.push(planned.edit);
      links.push(planned.link);
    }
    let after = before;
    for (const edit of edits.sort((left, right) => right.start - left.start)) {
      after = after.slice(0, edit.start) + edit.text + after.slice(edit.end);
    }
    if (after !== before) plan.changes.push({ after, before, file: name, links });
  } catch (error) {
    plan.skipped.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function buildLinkFixPlan(
  files: string[],
  rootDir: string,
  searchFiles: string[],
): LinkFixPlan {
  const root = fs.realpathSync(rootDir);
  const registry = buildDocsRegistry(root, searchFiles);
  const plan: LinkFixPlan = {
    changes: [],
    registry: {
      anchors: Object.values(registry.files).reduce((sum, file) => sum + file.slugs.length, 0),
      documents: Object.keys(registry.files).length,
    },
    root,
    skipped: [...registry.skipped],
  };
  for (const input of [...new Set(files)].sort()) planDocument(root, input, registry, plan);
  plan.skipped.sort();
  return plan;
}

export function fingerprintLinkFixPlan(plan: LinkFixPlan): string {
  return hash(
    JSON.stringify({
      changes: [...plan.changes]
        .sort((left, right) => left.file.localeCompare(right.file))
        .map((change) => ({
          after: hash(change.after),
          before: hash(change.before),
          file: change.file,
          links: [...change.links].sort(
            (left, right) => left.line - right.line || left.from.localeCompare(right.from),
          ),
        })),
      root: plan.root,
      skipped: [...plan.skipped].sort(),
    }),
  );
}

function assertUnchanged(
  plan: LinkFixPlan,
  change: LinkChange,
  appliedFiles = new Map<string, string>(),
): string {
  const file = safeFile(plan.root, change.file);
  if (readUtf8(file) !== change.before) throw new Error(`Changed since preview: ${change.file}`);
  for (const link of change.links) {
    const target = safeFile(plan.root, link.target);
    const current = appliedFiles.get(link.target);
    const expected = current === undefined ? link.targetHash : hash(current);
    if (hash(readUtf8(target)) !== expected)
      throw new Error(`Destination changed since preview: ${link.target}`);
    if (fs.existsSync(path.resolve(plan.root, link.missingTarget))) {
      throw new Error(`Original destination now exists: ${link.missingTarget}`);
    }
  }
  return file;
}

function rollback(plan: LinkFixPlan, backup: string, applied: number[]): void {
  const failed: string[] = [];
  for (const index of applied.reverse()) {
    const change = plan.changes[index];
    if (!change) continue;
    try {
      fs.copyFileSync(path.join(backup, String(index)), safeFile(plan.root, change.file));
    } catch {
      failed.push(change.file);
    }
  }
  if (failed.length)
    throw new Error(`Rollback incomplete for ${failed.join(", ")}; restore from ${backup}`);
}

/** Backup every change, then roll back if a later write fails. */
export function applyLinkFixPlan(plan: LinkFixPlan): string | undefined {
  if (!plan.changes.length) return undefined;
  if (fs.realpathSync(plan.root) !== plan.root) throw new Error("Root changed since preview");
  for (const change of plan.changes) assertUnchanged(plan, change);
  const backupRoot = path.join(plan.root, ".link-fix-backups");
  fs.mkdirSync(backupRoot, { recursive: true });
  if (fs.lstatSync(backupRoot).isSymbolicLink() || !fs.statSync(backupRoot).isDirectory()) {
    throw new Error("Backup path must be a real directory");
  }
  const backup = fs.mkdtempSync(path.join(backupRoot, "run-"));
  for (const [index, change] of plan.changes.entries()) {
    fs.copyFileSync(
      assertUnchanged(plan, change),
      path.join(backup, String(index)),
      fs.constants.COPYFILE_EXCL,
    );
  }
  fs.writeFileSync(
    path.join(backup, "manifest.json"),
    `${JSON.stringify(
      plan.changes.map((change, index) => ({
        backup: String(index),
        beforeHash: hash(change.before),
        file: change.file,
      })),
      null,
      2,
    )}\n`,
  );
  const applied: number[] = [];
  const appliedFiles = new Map<string, string>();
  try {
    for (const [index, change] of plan.changes.entries()) {
      const file = assertUnchanged(plan, change, appliedFiles);
      applied.push(index);
      fs.writeFileSync(file, change.after, "utf8");
      appliedFiles.set(change.file, change.after);
    }
  } catch (error) {
    rollback(plan, backup, applied);
    throw error;
  }
  return backup;
}
