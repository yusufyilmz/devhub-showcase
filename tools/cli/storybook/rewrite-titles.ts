/**
 * Rewrites CSF `meta.title` from monorepo-relative paths.
 *
 * `packages/<pkg>/src/...` and `apps/<app>/src/...` become
 * `<Package>/<folders…>/<Leaf>`. `src`, `components`, `stories`, and `__stories__`
 * are omitted. A story basename that repeats its folder (`ChatBubble` beside
 * `chat-bubble`, or `flex.stories` beside `flex`) is omitted, and so are `index` and `examples`.
 * Only the top-level `title` on `const meta` or `export default` is changed.
 * Nested `title` props, including `args.title`, stay as they are.
 */

import fs from "node:fs";
import path from "node:path";

import { glob } from "glob";

import { logInfo } from "../shared/logger/log.ts";

/** Title inside `<Meta title="…" />`. */
const FIRST_META_SELF_CLOSE = /<Meta\b[\s\S]*?\/>/;

/** Co-located `const STORY_TITLE = "…"` used by `meta.title`. */
const STORY_TITLE_CONST_REGEX = /(const STORY_TITLE\s*=\s*(?:\r?\n\s*)?)(["'])([^"']+)\2/;

const GLOB_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
  "**/.next/**",
  "**/storybook-static/**",
  "**/.turbo/**",
];

const ACRONYMS = new Set([
  "ai",
  "api",
  "cli",
  "css",
  "cta",
  "cv",
  "faq",
  "html",
  "id",
  "otp",
  "pdf",
  "ui",
  "url",
]);

const WORD_LABELS: Record<string, string> = {
  github: "GitHub",
  ios: "iOS",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

/** Folder names that organize files and are not Storybook groups. */
const SKIPPED_TITLE_PATH_SEGMENTS = new Set(["__stories__", "components", "src", "stories"]);

const PACKAGE_ROOTS: Record<string, string> = {
  assistant: "Assistant",
  "my-dev-studio": "Studio",
  "my-fitness-app": "Fitness",
  "storybook-app": "Storybook",
  trello: "Trello",
  ui: "UI",
};

const EXCLUDED_SEGMENTS = ["storybook-app.mdx"];

interface StringTitle {
  end: number;
  kind: "string";
  quote: string;
  value: string;
  valueEnd: number;
  valueStart: number;
}

interface RefTitle {
  end: number;
  kind: "ref";
  name: string;
}

type TitleHit = RefTitle | StringTitle;

function walkUpFindStorybookPackage(startDir: string): string | null {
  let dir = path.resolve(startDir);
  for (;;) {
    const hasStorybook = fs.existsSync(path.join(dir, ".storybook"));
    const hasPackageJson = fs.existsSync(path.join(dir, "package.json"));
    if (hasStorybook && hasPackageJson) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function resolveProjectRoot(explicit: string | null): string {
  const start = path.resolve(explicit ?? process.cwd());
  const nested = path.join(start, "apps/storybook-app");
  if (fs.existsSync(path.join(nested, ".storybook"))) return nested;
  return walkUpFindStorybookPackage(start) ?? start;
}

function resolveMonorepoRoot(fromDir: string): string | null {
  let dir = path.resolve(fromDir);
  for (;;) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function isIdentStart(char: string): boolean {
  return /[A-Za-z_$]/.test(char);
}

function isIdentPart(char: string): boolean {
  return /[A-Za-z0-9_$]/.test(char);
}

function splitWords(segment: string): string[] {
  return segment
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function labelWord(word: string): string {
  const lower = word.toLowerCase();
  return (
    WORD_LABELS[lower] ??
    (ACRONYMS.has(lower) ? lower.toUpperCase() : lower.charAt(0).toUpperCase() + lower.slice(1))
  );
}

function humanizeSegment(segment: string): string {
  return splitWords(segment).map(labelWord).join(" ");
}

function titleKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function packageRoot(packageDir: string): string {
  return PACKAGE_ROOTS[packageDir] ?? humanizeSegment(packageDir);
}

function packageLocation(dirParts: string[]): { name: string; srcIndex: number } | null {
  const name = dirParts[1];
  if ((dirParts[0] !== "packages" && dirParts[0] !== "apps") || !name) return null;
  const srcIndex = dirParts.indexOf("src", 2);
  if (srcIndex === -1) return null;
  return { name, srcIndex };
}

function humanizeLeaf(baseName: string): string | null {
  const stem = baseName
    .replace(/\.stories\.(tsx|ts|jsx|js|mjs|mdx)$/i, "")
    .replace(/\.mdx$/i, "")
    .replace(/\.(tsx|ts|jsx|js|mjs)$/i, "");
  if (!stem || stem === baseName) return null;
  const label = humanizeSegment(stem);
  return label || null;
}

/** Derive Storybook `meta.title` from a monorepo-relative story or MDX path. */
export function pathToMetaTitle(relativePath: string): string {
  const normalized = relativePath.replaceAll("\\", "/");
  const dirParts = path.posix.dirname(normalized).split("/").filter(Boolean);
  const located = packageLocation(dirParts);
  const folderParts = located ? dirParts.slice(located.srcIndex + 1) : dirParts;
  const segments = [
    ...(located ? [packageRoot(located.name)] : []),
    ...folderParts
      .filter((part) => !SKIPPED_TITLE_PATH_SEGMENTS.has(part))
      .map((part) => humanizeSegment(part)),
  ];
  const leaf = humanizeLeaf(path.posix.basename(normalized));
  const parent = segments.at(-1);
  const omittedLeaf = leaf === null || titleKey(leaf) === "index" || titleKey(leaf) === "examples";
  if (!omittedLeaf && (!parent || titleKey(leaf) !== titleKey(parent))) {
    segments.push(leaf);
  }
  return segments.length > 0 ? segments.join("/") : "Overview";
}

function relativeTitlePath(absFilePath: string, root: string, monorepoRoot: string | null): string {
  const abs = path.resolve(absFilePath);
  if (monorepoRoot) {
    const repo = path.resolve(monorepoRoot);
    if (abs === repo || abs.startsWith(`${repo}${path.sep}`)) {
      return path.relative(repo, abs).replaceAll("\\", "/");
    }
  }
  return path.relative(root, abs).replaceAll("\\", "/");
}

function consumeComment(content: string, index: number): number {
  if (content.startsWith("//", index)) {
    const next = content.indexOf("\n", index + 2);
    return next === -1 ? content.length : next + 1;
  }
  if (content.startsWith("/*", index)) {
    const next = content.indexOf("*/", index + 2);
    return next === -1 ? content.length : next + 2;
  }
  return index;
}

function consumeString(content: string, index: number): number {
  const quote = content[index];
  if (quote !== "'" && quote !== '"' && quote !== "`") return index;
  let cursor = index + 1;
  while (cursor < content.length) {
    const char = content[cursor] ?? "";
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === quote) return cursor + 1;
    cursor += 1;
  }
  return content.length;
}

function skipWhitespace(content: string, index: number): number {
  let cursor = index;
  while (/\s/.test(content[cursor] ?? "")) cursor += 1;
  return cursor;
}

function readIdentifier(content: string, index: number): { end: number; name: string } | null {
  if (!isIdentStart(content[index] ?? "")) return null;
  let cursor = index + 1;
  while (isIdentPart(content[cursor] ?? "")) cursor += 1;
  return { end: cursor, name: content.slice(index, cursor) };
}

function readTitleValue(content: string, index: number): TitleHit | null {
  const quote = content[index];
  if (quote === "'" || quote === '"') {
    let cursor = index + 1;
    let value = "";
    while (cursor < content.length) {
      const char = content[cursor] ?? "";
      if (char === "\\") {
        value += content[cursor + 1] ?? "";
        cursor += 2;
        continue;
      }
      if (char === quote) {
        return {
          end: cursor + 1,
          kind: "string",
          quote,
          value,
          valueEnd: cursor,
          valueStart: index + 1,
        };
      }
      value += char;
      cursor += 1;
    }
    return null;
  }
  const ident = readIdentifier(content, index);
  return ident ? { end: ident.end, kind: "ref", name: ident.name } : null;
}

interface MetaScan {
  bracket: number;
  cursor: number;
  depth: number;
  paren: number;
  title: TitleHit | null;
}

function skipTrivia(content: string, state: MetaScan): boolean {
  const commentEnd = consumeComment(content, state.cursor);
  if (commentEnd !== state.cursor) {
    state.cursor = commentEnd;
    return true;
  }
  const stringEnd = consumeString(content, state.cursor);
  if (stringEnd === state.cursor) return false;
  state.cursor = stringEnd;
  return true;
}

function trackEnclosure(state: MetaScan, char: string): boolean {
  if (char === "{") state.depth += 1;
  else if (char === "}") state.depth -= 1;
  else if (char === "[") state.bracket += 1;
  else if (char === "]") state.bracket -= 1;
  else if (char === "(") state.paren += 1;
  else if (char === ")") state.paren -= 1;
  else return false;
  state.cursor += 1;
  return true;
}

function readTopLevelTitle(content: string, state: MetaScan): boolean {
  if (state.depth !== 1 || state.bracket !== 0 || state.paren !== 0) return false;
  const ident = readIdentifier(content, state.cursor);
  if (!ident) return false;
  state.cursor = ident.end;
  if (ident.name !== "title" || state.title) return true;
  const colon = skipWhitespace(content, state.cursor);
  if (content[colon] !== ":") return true;
  const value = readTitleValue(content, skipWhitespace(content, colon + 1));
  if (!value) return true;
  state.title = value;
  state.cursor = value.end;
  return true;
}

function walkMeta(content: string, open: number): { title: TitleHit | null } | null {
  const state: MetaScan = { bracket: 0, cursor: open, depth: 0, paren: 0, title: null };
  while (state.cursor < content.length) {
    if (skipTrivia(content, state)) continue;
    const char = content[state.cursor] ?? "";
    if (char === "}" && state.depth === 1) return { title: state.title };
    if (trackEnclosure(state, char)) continue;
    if (readTopLevelTitle(content, state)) continue;
    state.cursor += 1;
  }
  return null;
}

function inspectMeta(content: string): { title: TitleHit | null } | null {
  const match =
    /\bconst\s+meta\b[^=]*=\s*\{/.exec(content) ?? /\bexport\s+default\s*\{/.exec(content);
  if (!match) return null;
  return walkMeta(content, match.index + match[0].length - 1);
}

function escapeTitle(value: string, quote: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll(quote, `\\${quote}`);
}

function replaceStoryTitleConstant(
  content: string,
  expectedTitle: string,
): { next: string; previousTitle: string | null } {
  const match = content.match(STORY_TITLE_CONST_REGEX);
  const prefix = match?.[1] ?? "";
  const quote = match?.[2];
  const currentTitle = match?.[3] ?? "";
  if (!quote) return { next: content, previousTitle: null };
  if (currentTitle === expectedTitle) return { next: content, previousTitle: currentTitle };
  return {
    next: content.replace(
      STORY_TITLE_CONST_REGEX,
      `${prefix}${quote}${escapeTitle(expectedTitle, quote)}${quote}`,
    ),
    previousTitle: currentTitle,
  };
}

/** Replace the top-level CSF meta title, leaving nested `title` props untouched. */
export function rewriteStoryTitle(
  content: string,
  expectedTitle: string,
): { next: string; previousTitle: string | null } {
  const meta = inspectMeta(content);
  if (!meta?.title) return { next: content, previousTitle: null };

  let next = content;
  let previousTitle: string | null = null;
  if (meta.title.kind === "string" && meta.title.value !== expectedTitle) {
    previousTitle = meta.title.value;
    next =
      content.slice(0, meta.title.valueStart) +
      escapeTitle(expectedTitle, meta.title.quote) +
      content.slice(meta.title.valueEnd);
  } else if (meta.title.kind === "string") {
    previousTitle = meta.title.value;
  } else if (meta.title.kind === "ref" && meta.title.name === "STORY_TITLE") {
    previousTitle = content.match(STORY_TITLE_CONST_REGEX)?.[3] ?? null;
  } else {
    return { next: content, previousTitle: null };
  }

  if (STORY_TITLE_CONST_REGEX.test(next)) {
    const updated = replaceStoryTitleConstant(next, expectedTitle);
    next = updated.next;
    previousTitle ??= updated.previousTitle;
  }
  return { next, previousTitle };
}

function replaceFirstMetaTitle(
  content: string,
  expectedTitle: string,
): { next: string; previousTitle: string | null } {
  const match = content.match(FIRST_META_SELF_CLOSE);
  if (!match || match.index === undefined) {
    return {
      next: `<Meta title="${expectedTitle}" />\n\n${content.trimStart()}`,
      previousTitle: null,
    };
  }
  const block = match[0];
  const titleMatch = block.match(/\btitle\s*=\s*"([^"]*)"/);
  const previousTitle = titleMatch?.[1] ?? null;
  const newBlock = titleMatch
    ? block.replace(/\btitle\s*=\s*"[^"]*"/, `title="${expectedTitle}"`)
    : block.replace(/<Meta\b/, `<Meta title="${expectedTitle}" `);
  return {
    next: content.slice(0, match.index) + newBlock + content.slice(match.index + block.length),
    previousTitle,
  };
}

interface UpdateResult {
  modified: boolean;
  new: string;
  old: string | null;
  relativePath: string;
}

function isExcludedSegment(fileName: string): boolean {
  return EXCLUDED_SEGMENTS.includes(fileName);
}

function updateMdxFile(
  filePath: string,
  root: string,
  monorepoRoot: string | null,
  dryRun: boolean,
): UpdateResult {
  const relativePath = relativeTitlePath(filePath, root, monorepoRoot);
  const expectedTitle = pathToMetaTitle(relativePath);
  const content = fs.readFileSync(filePath, "utf8");
  const { next, previousTitle } = replaceFirstMetaTitle(content, expectedTitle);
  if (next !== content && !dryRun) fs.writeFileSync(filePath, next, "utf8");
  return { modified: next !== content, new: expectedTitle, old: previousTitle, relativePath };
}

function updateStoryFile(
  filePath: string,
  root: string,
  monorepoRoot: string | null,
  dryRun: boolean,
): UpdateResult {
  const relativePath = relativeTitlePath(filePath, root, monorepoRoot);
  const expectedTitle = pathToMetaTitle(relativePath);
  const content = fs.readFileSync(filePath, "utf8");
  const { next, previousTitle } = rewriteStoryTitle(content, expectedTitle);
  if (next !== content && !dryRun) fs.writeFileSync(filePath, next, "utf8");
  return { modified: next !== content, new: expectedTitle, old: previousTitle, relativePath };
}

export type RewriteMdxTitlesOptions = {
  cwd?: string;
  dryRun?: boolean;
  verbose?: boolean;
};

function logUpdate(result: UpdateResult): void {
  logInfo(`✅ ${result.relativePath}`);
  if (result.old) logInfo(`   Old: ${result.old}`);
  logInfo(`   New: ${result.new}\n`);
}

const LOCAL_STORY_GLOBS = ["src/**/*.stories.tsx", "src/**/*.stories.ts", "src/**/*.stories.mjs"];
const REPO_MDX_GLOBS = [
  "packages/**/*.mdx",
  "apps/**/*.mdx",
  "docs/**/*.mdx",
  "documentation/**/*.mdx",
];
const REPO_STORY_GLOBS = [
  "packages/**/*.stories.tsx",
  "packages/**/*.stories.ts",
  "packages/**/*.stories.mjs",
  "apps/**/*.stories.tsx",
  "apps/**/*.stories.ts",
  "apps/**/*.stories.mjs",
];

async function globUnique(patterns: string[], cwd: string): Promise<string[]> {
  const matches = await glob(patterns, { absolute: true, cwd, ignore: GLOB_IGNORE });
  return [...new Set(matches)];
}

interface RewriteCounts {
  excluded: number;
  modified: number;
  upToDate: number;
}

function rewriteFiles(
  files: string[],
  verbose: boolean,
  update: (file: string) => UpdateResult,
): RewriteCounts {
  const counts = { excluded: 0, modified: 0, upToDate: 0 };
  for (const file of files) {
    if (isExcludedSegment(path.basename(file))) {
      counts.excluded += 1;
      if (verbose) logInfo(`Excluded segment: ${path.basename(file)}`);
      continue;
    }
    const result = update(file);
    if (!result.modified) {
      counts.upToDate += 1;
      continue;
    }
    counts.modified += 1;
    logUpdate(result);
  }
  return counts;
}

function logRewriteSummary(label: string, total: number, counts: RewriteCounts): void {
  logInfo(
    `📊 ${label}: ${total - counts.excluded} file(s) checked (${counts.excluded} skipped); ${counts.modified} updated; ${counts.upToDate} already matched.`,
  );
}

export async function runRewriteMdTitles(options: RewriteMdxTitlesOptions = {}): Promise<number> {
  const dryRun = options.dryRun ?? false;
  const verbose = options.verbose ?? false;
  const root = resolveProjectRoot(options.cwd ? path.resolve(options.cwd) : null);
  const monorepoRoot = resolveMonorepoRoot(root);
  const mdxFiles = await globUnique(
    monorepoRoot ? REPO_MDX_GLOBS : ["**/*.mdx"],
    monorepoRoot ?? root,
  );
  const storyFiles = await globUnique(
    monorepoRoot ? REPO_STORY_GLOBS : LOCAL_STORY_GLOBS,
    monorepoRoot ?? root,
  );
  const scope = monorepoRoot ? ` + repo stories (${path.basename(monorepoRoot)})` : "";
  logInfo(`🏷️  Rewriting titles from path (Storybook package: ${path.basename(root)})${scope}\n`);

  const mdx = rewriteFiles(mdxFiles, verbose, (file) =>
    updateMdxFile(file, root, monorepoRoot, dryRun),
  );
  const stories = rewriteFiles(storyFiles, verbose, (file) =>
    updateStoryFile(file, root, monorepoRoot, dryRun),
  );
  logRewriteSummary("MDX", mdxFiles.length, mdx);
  logRewriteSummary("Stories (CSF)", storyFiles.length, stories);
  const modified = mdx.modified + stories.modified;
  if (modified === 0) logInfo("✅ No files needed changes.");
  else logInfo(`✅ Updated ${modified} file(s) total.`);
  if (modified > 0 && dryRun) logInfo("💡 Run without --dry-run to apply.");
  logInfo(`${"=".repeat(60)}\n`);
  return 0;
}
