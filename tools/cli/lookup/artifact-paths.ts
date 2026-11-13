/** Canonical repository lookup roots. Package catalogs and skill files are not read from `.ai`. */
export const SKILL_DISCOVERY_TARGETS = [
  ".agents/skills",
  ".claude/skills",
  ".cursor/skills",
] as const;
export const SKIP_DIR_NAMES = new Set(["node_modules", ".git", ".next", ".turbo", "dist", "build"]);
export const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
