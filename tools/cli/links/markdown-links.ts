import fs from "node:fs";
import path from "node:path";

export interface DocIssue {
  file: string;
  line?: number;
  message: string;
  rule: string;
  severity: "error" | "warn";
  url?: string;
}

type LinkOccurrence = { url: string; index: number };
function maskFenceLine(
  line: string,
  state: { char: string; inFence: boolean; length: number },
): string {
  const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
  if (!fenceMatch) return state.inFence ? maskNonNewline(line) : maskInlineCode(line);
  const marker = fenceMatch[1] ?? "";
  const markerChar = marker[0] ?? "";
  if (!state.inFence) {
    state.inFence = true;
    state.char = markerChar;
    state.length = marker.length;
    return maskNonNewline(line);
  }
  if (markerChar === state.char && marker.length >= state.length) {
    state.inFence = false;
    state.char = "";
    state.length = 0;
  }
  return maskNonNewline(line);
}

function maskCode(content: string): string {
  const output: string[] = [];
  const parts = content.split(/(\r\n|\n|\r)/);
  const state = { char: "", inFence: false, length: 0 };

  for (let index = 0; index < parts.length; index += 2) {
    output.push(maskFenceLine(parts[index] ?? "", state));
    const lineEnding = parts[index + 1];
    if (lineEnding) output.push(lineEnding);
  }

  return output.join("").replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\r\n]/g, " "));
}

function maskNonNewline(value: string): string {
  return " ".repeat(value.length);
}

function maskInlineCode(line: string): string {
  const chars = line.split("");
  let inCode = false;
  let markerLength = 0;

  for (let index = 0; index < line.length; ) {
    if (line[index] !== "`") {
      if (inCode) {
        chars[index] = " ";
      }

      index += 1;
      continue;
    }

    let runLength = 1;

    while (line[index + runLength] === "`") {
      runLength += 1;
    }

    if (!inCode) {
      inCode = true;
      markerLength = runLength;
    } else if (runLength === markerLength) {
      inCode = false;
      markerLength = 0;
    }

    for (let cursor = index; cursor < index + runLength; cursor += 1) {
      chars[cursor] = " ";
    }

    index += runLength;
  }

  return chars.join("");
}

function readBareDestination(content: string, start: number): { end: number; url: string } | null {
  let index = start;
  let depth = 0;
  let escaped = false;
  for (; index < content.length; index += 1) {
    const step = bareDestinationStep(content[index], depth, escaped);
    if (step.kind === "break") break;
    if (step.kind === "invalid") return null;
    depth = step.depth;
    escaped = step.escaped;
  }
  const url = content.slice(start, index);
  return url ? { end: index, url } : null;
}

function bareDestinationStep(
  char: string | undefined,
  depth: number,
  escaped: boolean,
): { depth: number; escaped: boolean; kind: "break" | "continue" | "invalid" } {
  if (escaped) return { depth, escaped: false, kind: "continue" };
  if (char === "\\") return { depth, escaped: true, kind: "continue" };
  if (char === "(") return { depth: depth + 1, escaped: false, kind: "continue" };
  if (char === ")") {
    if (depth === 0) return { depth, escaped: false, kind: "break" };
    return { depth: depth - 1, escaped: false, kind: "continue" };
  }
  if (depth === 0 && /\s/.test(char ?? "")) return { depth, escaped: false, kind: "break" };
  if (char === "\n" || char === "\r") return { depth, escaped: false, kind: "invalid" };
  return { depth, escaped: false, kind: "continue" };
}

function parseDestination(
  content: string,
  startIndex: number,
): { endIndex: number; url: string } | null {
  let index = startIndex;
  while (/\s/.test(content[index] ?? "")) index += 1;
  if (content[index] === "<") {
    const end = content.indexOf(">", index + 1);
    if (end < 0) return null;
    return consumeLinkTail(content, end + 1, content.slice(index + 1, end));
  }
  const bare = readBareDestination(content, index);
  if (!bare) return null;
  return consumeLinkTail(content, bare.end, bare.url);
}

function skipQuotedTitle(content: string, startIndex: number, quote: string): number {
  let escaped = false;
  for (let index = startIndex + 1; index < content.length; index += 1) {
    const char = content[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) return index + 1;
  }
  return content.length;
}

function skipParenTitle(content: string, startIndex: number): number {
  let depth = 1;
  let escaped = false;
  for (let index = startIndex + 1; index < content.length; index += 1) {
    const char = content[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "(") depth += 1;
    if (char !== ")") continue;
    depth -= 1;
    if (depth === 0) return index + 1;
  }
  return content.length;
}

function skipLinkTitle(content: string, startIndex: number): number | null {
  const opener = content[startIndex];
  if (opener === '"' || opener === "'") return skipQuotedTitle(content, startIndex, opener);
  if (opener === "(") return skipParenTitle(content, startIndex);
  return null;
}

function consumeLinkTail(
  content: string,
  startIndex: number,
  url: string,
): { endIndex: number; url: string } | null {
  let index = startIndex;
  while (/\s/.test(content[index] ?? "")) index += 1;
  if (content[index] !== ")") {
    const next = skipLinkTitle(content, index);
    if (next === null) return null;
    index = next;
  }
  while (/\s/.test(content[index] ?? "")) index += 1;
  if (content[index] !== ")") return null;
  return { endIndex: index + 1, url };
}

function extractInlineLinks(content: string): LinkOccurrence[] {
  const links: LinkOccurrence[] = [];
  const opener = /!?\[[^\]\n]*\]\(/g;

  for (;;) {
    const match = opener.exec(content);
    if (!match) break;
    const openParenIndex = match.index + match[0].length - 1;

    const destination = parseDestination(content, openParenIndex + 1);

    if (!destination) {
      continue;
    }

    links.push({
      index: match.index,
      url: destination.url.trim(),
    });

    opener.lastIndex = destination.endIndex;
  }

  return links;
}

function normalizeReferenceLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

function extractReferenceDefinitions(content: string): Map<string, string> {
  const definitions = new Map<string, string>();

  const definitionRe = /^[ \t]{0,3}\[([^\]\n]+)\]:[ \t]*(?:<([^>\n]+)>|(\S+))(?:[ \t]+.*)?$/gm;

  for (;;) {
    const match = definitionRe.exec(content);
    if (!match) break;
    const url = (match[2] ?? match[3] ?? "").trim();

    if (url) {
      definitions.set(normalizeReferenceLabel(match[1] ?? ""), url);
    }
  }

  return definitions;
}

function extractReferenceLinks(
  content: string,
  definitions: Map<string, string>,
): LinkOccurrence[] {
  const links: LinkOccurrence[] = [];
  const referenceRe = /!?\[[^\]\n]+\]\[([^\]\n]*)\]/g;

  for (;;) {
    const match = referenceRe.exec(content);
    if (!match) break;
    const label = normalizeReferenceLabel(match[1] ?? "");

    const textStart = match.index + (match[0].startsWith("!") ? 1 : 0);

    const textEnd = content.indexOf("]", textStart + 1);

    const text = textEnd >= 0 ? content.slice(textStart + 1, textEnd) : "";

    const key = label || normalizeReferenceLabel(text);

    const url = definitions.get(key);
    links.push({
      index: match.index,
      url: url ?? `reference:${key}`,
    });
  }

  return links;
}

export function extractLinks(content: string): LinkOccurrence[] {
  const maskedContent = maskCode(content);
  const definitions = extractReferenceDefinitions(maskedContent);

  const links = [
    ...extractInlineLinks(maskedContent),
    ...extractReferenceLinks(maskedContent, definitions),
  ];

  const shortcut = /!?\[([^\]\n]+)\](?![[(])/g;
  for (;;) {
    const match = shortcut.exec(maskedContent);
    if (!match) break;
    const before = maskedContent.slice(0, match.index).split("\n").pop() ?? "";
    if (/^\s*$/.test(before) && maskedContent[shortcut.lastIndex] === ":") continue;
    const url = definitions.get(normalizeReferenceLabel(match[1] ?? ""));
    const index = match.index;
    if (url && !links.some((link) => link.index <= index && link.index + 2 > index)) {
      links.push({ index, url });
    }
  }
  const seen = new Set<string>();

  return links.filter((link) => {
    const key = `${link.index}:${link.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface LinkDestination {
  end: number;
  index: number;
  start: number;
  url: string;
}

function pushInlineDestination(
  masked: string,
  match: RegExpExecArray,
  result: LinkDestination[],
): number | undefined {
  let start = match.index + match[0].length;
  while (/\s/.test(masked[start] ?? "")) start += 1;
  const destination = parseDestination(masked, start);
  if (!destination) return undefined;
  if (masked[start] === "<") start += 1;
  result.push({
    end: start + destination.url.length,
    index: match.index,
    start,
    url: destination.url,
  });
  return destination.endIndex;
}

function collectInlineDestinations(masked: string): LinkDestination[] {
  const result: LinkDestination[] = [];
  const opener = /!?\[[^\]\n]*\]\(/g;
  for (;;) {
    const match = opener.exec(masked);
    if (!match) break;
    const end = pushInlineDestination(masked, match, result);
    if (end !== undefined) opener.lastIndex = end;
  }
  return result;
}

function dropDefinition(result: LinkDestination[], index: number | undefined): void {
  for (let cursor = result.length - 1; cursor >= 0; cursor -= 1) {
    if (result[cursor]?.index === index) result.splice(cursor, 1);
  }
}

function pushDefinitionDestination(
  masked: string,
  match: RegExpExecArray,
  result: LinkDestination[],
  labels: Set<string>,
  definitionsByLabel: Map<string, number>,
): void {
  const label = normalizeReferenceLabel(match[1] ?? "");
  if (labels.has(label)) {
    dropDefinition(result, definitionsByLabel.get(label));
    return;
  }
  labels.add(label);
  const url = match[2] ?? match[3] ?? "";
  let start = match.index + match[0].indexOf("]:") + 2;
  while (/[ \t]/.test(masked[start] ?? "")) start += 1;
  if (masked[start] === "<") start += 1;
  definitionsByLabel.set(label, match.index);
  if (!url) return;
  result.push({ end: start + url.length, index: match.index, start, url });
}

function collectDefinitionDestinations(masked: string, result: LinkDestination[]): void {
  const definitions = /^[ \t]{0,3}\[([^\]\n]+)\]:[ \t]*(?:<([^>\n]+)>|(\S+))(?:[ \t]+.*)?$/gm;
  const labels = new Set<string>();
  const definitionsByLabel = new Map<string, number>();
  for (;;) {
    const match = definitions.exec(masked);
    if (!match) break;
    pushDefinitionDestination(masked, match, result, labels, definitionsByLabel);
  }
}

/** Editable destinations only. Reference definitions are edited once, not each use. */
export function extractLinkDestinations(content: string): LinkDestination[] {
  const masked = maskCode(content);
  const result = collectInlineDestinations(masked);
  collectDefinitionDestinations(masked, result);
  return result.sort((left, right) => left.start - right.start);
}

/** GitHub-style Markdown heading IDs, including duplicate suffixes and explicit HTML IDs. */
function headingSlug(title: string): string {
  return title
    .replace(/<[^>]*>/g, "")
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, "")
    .replace(/\s/g, "-");
}

function addHeadingAnchor(title: string, anchors: Set<string>, counts: Map<string, number>): void {
  const slug = headingSlug(title);
  let candidate = slug;
  let suffix = counts.get(slug) ?? 0;
  while (anchors.has(candidate)) candidate = `${slug}-${++suffix}`;
  counts.set(slug, suffix);
  anchors.add(candidate);
}

/** GitHub-style Markdown heading IDs, including duplicate suffixes and explicit HTML IDs. */
export function headingAnchors(content: string): Set<string> {
  const withoutFences = content.replace(
    /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gm,
    "",
  );
  const anchors = new Set<string>();
  const counts = new Map<string, number>();
  const lines = withoutFences.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const atx = /^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    const setext = line.trim() && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1] ?? "");
    const title = atx?.[1] ?? (setext ? line : undefined);
    if (title !== undefined) addHeadingAnchor(title, anchors, counts);
  }
  for (const match of withoutFences.matchAll(
    /<(?:a|[a-z][\w-]*)\b[^>]*\b(?:id|name)=["']([^"']+)["'][^>]*>/gi,
  )) {
    if (match[1]) anchors.add(match[1]);
  }
  return anchors;
}
function isWithin(root: string, file: string): boolean {
  const relative = path.relative(root, file);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function decodeLocalUrl(url: string): { fragment: string; pathname: string } | undefined {
  try {
    const hash = url.indexOf("#");
    return {
      fragment: hash < 0 ? "" : decodeURIComponent(url.slice(hash + 1)),
      pathname: decodeURIComponent(
        (hash < 0 ? url : url.slice(0, hash)).split("?")[0] ?? "",
      ).replace(/\\([()[\] ])/g, "$1"),
    };
  } catch {
    return undefined;
  }
}

function anchorIssue(
  real: string,
  fragment: string,
  cache: Map<string, Set<string>>,
): string | undefined {
  if (!fragment || !/\.(md|mdx|skill)$/i.test(real) || !fs.statSync(real).isFile())
    return undefined;
  if (!cache.has(real)) cache.set(real, headingAnchors(fs.readFileSync(real, "utf8")));
  if (cache.get(real)?.has(fragment)) return undefined;
  return `Heading/HTML anchor #${fragment} does not exist`;
}

function localLinkMessage(
  link: LinkOccurrence,
  file: string,
  root: string,
  cache: Map<string, Set<string>>,
): string | undefined {
  if (link.url.startsWith("reference:")) return "Reference definition is missing";
  if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(link.url)) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link.url)) return "Unsupported local-link scheme";
  if (/[{}]/.test(link.url)) return undefined;
  const decoded = decodeLocalUrl(link.url);
  if (!decoded) return "Invalid URL encoding";
  const target = decoded.pathname
    ? path.resolve(
        decoded.pathname.startsWith("/") ? root : path.dirname(file),
        decoded.pathname.startsWith("/") ? `.${decoded.pathname}` : decoded.pathname,
      )
    : file;
  if (!isWithin(root, target)) return "Target escapes --root";
  if (!fs.existsSync(target)) return "Target does not exist";
  const real = fs.realpathSync(target);
  if (!isWithin(root, real)) return "Symlink target escapes --root";
  return anchorIssue(real, decoded.fragment, cache);
}

/** No HTTP requests. Checks local files, images, references and heading-only links. */
export function validateLocalLinks(files: string[], rootDir: string): DocIssue[] {
  const issues: DocIssue[] = [];
  const cache = new Map<string, Set<string>>();
  const root = fs.realpathSync(rootDir);
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const link of extractLinks(content)) {
      const message = localLinkMessage(link, file, root, cache);
      if (!message) continue;
      issues.push({
        file: path.relative(root, file).split(path.sep).join("/"),
        line: content.slice(0, link.index).split("\n").length,
        message: `${link.url}: ${message}`,
        rule: "local-link",
        severity: "error",
        url: link.url,
      });
    }
  }
  return issues;
}
