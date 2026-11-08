/** Canonical repository lookup roots; generated directories are never traversed. */
export const SKILL_DISCOVERY_TARGETS = [
  ".agents/skills",
  ".ai/skills",
  ".claude/skills",
  ".cursor/skills",
] as const;
export const SKIP_DIR_NAMES = new Set(["node_modules", ".git", ".next", ".turbo", "dist", "build"]);
export const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
