import { createHash } from "node:crypto";

import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as load } from "yaml";

import { LookupError } from "./types.ts";

export interface MarkdownNode {
  children?: MarkdownNode[];
  depth?: number;
  position: { start: { offset: number }; end: { offset: number } };
  type: string;
  value?: string;
}
export function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
export function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
export function text(node?: MarkdownNode): string {
  if (!node) return "";
  return node.value ?? (node.children ?? []).map(text).join("");
}
export function markdown(content: string) {
  let body = content;
  let metadata: Record<string, unknown> = {};
  if (content.startsWith("---\n")) {
    const end = content.indexOf("\n---\n", 4);
    if (end < 0) throw new LookupError("invalid_schema", "Unclosed artifact frontmatter");
    const parsed: unknown = load(content.slice(4, end));
    if (!object(parsed))
      throw new LookupError("invalid_schema", "Artifact frontmatter must be a mapping");
    metadata = parsed;
    body = content.slice(end + 5);
  }
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body) as MarkdownNode;
  return { body, metadata, nodes: tree.children ?? [] };
}
export function versions(metadata: Record<string, unknown>, pkg?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (pkg && typeof metadata.version === "string") result[pkg] = metadata.version;
  if (object(metadata.packages))
    for (const [name, value] of Object.entries(metadata.packages)) {
      if (typeof value !== "string")
        throw new LookupError("invalid_schema", "Package versions must be strings");
      result[name] = value;
    }
  return result;
}
export function slug(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}
