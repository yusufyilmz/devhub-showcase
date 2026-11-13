import fs from "node:fs";
import path from "node:path";

import { parseDocument } from "yaml";

import { discoverDocs } from "../links/discover.ts";
import { validateLocalLinks } from "../links/markdown-links.ts";
import { logError, logInfo, logWarn } from "../shared/logger/log.ts";

const SKILL_GLOBS = [".agents/skills", ".cursor/skills", ".claude/skills"];
const MAX_LINES = 800;
const MAX_BYTES = 65_536;
const PLACEHOLDER = /\b(?:TODO|FIXME|TBD)\b|<INSERT_[A-Z_]+>|\{\{(?:TODO|PLACEHOLDER)[^}]*\}\}/;

function skillRoots(root: string): string[] {
  return SKILL_GLOBS.filter((dir) => fs.existsSync(path.join(root, dir)));
}

function markdownFiles(root: string): string[] {
  return [...new Set(discoverDocs(root, skillRoots(root)))];
}

function reportSize(relative: string, content: string): void {
  const lines = content.split(/\r?\n/).length;
  if (lines > MAX_LINES) logWarn(`${relative}: ${lines} lines exceeds advisory limit ${MAX_LINES}`);
  const bytes = Buffer.byteLength(content);
  if (bytes > MAX_BYTES) logWarn(`${relative}: ${bytes} bytes exceeds advisory limit ${MAX_BYTES}`);
}

function reportPlaceholders(relative: string, content: string): void {
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!PLACEHOLDER.test(line)) continue;
    logWarn(`${relative}:${index + 1}: review unresolved authoring placeholder`);
  }
}

function frontmatterError(
  relative: string,
  content: string,
  names: Map<string, string>,
): string | undefined {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match?.[1]) return `Invalid frontmatter: ${relative}`;
  const document = parseDocument(match[1]);
  if (document.errors.length) {
    return `${relative}: ${document.errors.map((error) => error.message).join("; ")}`;
  }
  const metadata = document.toJS() as { description?: string; name?: string };
  if (!metadata?.name || !metadata?.description) return `Missing name or description: ${relative}`;
  const previous = names.get(metadata.name);
  if (previous) return `Skill '${metadata.name}' also declared in ${previous}`;
  names.set(metadata.name, relative);
  return undefined;
}

/** Check skill frontmatter, size, placeholders, and local links. Size limits are advisory. */
export function validateSkills(rootDir: string, fix = false): number {
  const root = fs.realpathSync(rootDir);
  const files = markdownFiles(root);
  const names = new Map<string, string>();
  let errors = 0;
  for (const file of files) {
    const relative = path.relative(root, file);
    const content = fs.readFileSync(file, "utf8");
    reportSize(relative, content);
    reportPlaceholders(relative, content);
    if (path.basename(file) !== "SKILL.md") continue;
    const problem = frontmatterError(relative, content, names);
    if (problem) {
      logError(problem);
      errors += 1;
      continue;
    }
    if (fix) rewriteFrontmatter(file, content);
    logInfo(`✓ ${relative}`);
  }
  for (const issue of validateLocalLinks(files, root)) {
    logError(`${issue.file}:${issue.line ?? 1}: ${issue.message}`);
    errors += 1;
  }
  return errors === 0 ? 0 : 1;
}

function rewriteFrontmatter(file: string, content: string): void {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const document = parseDocument(match?.[1] ?? "");
  const updated = content.replace(match?.[0] ?? "", `---\n${document.toString().trimEnd()}\n---\n`);
  if (updated !== content) fs.writeFileSync(file, updated);
}
