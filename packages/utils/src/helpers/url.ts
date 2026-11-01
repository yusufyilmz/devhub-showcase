/**
 * URL helpers to safely compose base URLs and paths
 * Ensures there is exactly one slash between base and path
 */
export function stripTrailingSlash(input?: string | null): string {
  if (!input) return "";
  return input.replace(/\/+$/, "");
}

export function ensureLeadingSlash(path?: string | null): string {
  if (!path) return "";
  return `/${path.replace(/^\/+/, "")}`;
}

export function joinUrl(base: string | undefined | null, path: string | undefined | null): string {
  const b = stripTrailingSlash(base || "");
  const p = ensureLeadingSlash(path || "");
  return `${b}${p}`;
}

export function toAbsoluteUrl(base: string | undefined | null, maybeUrl: string): string {
  // If maybeUrl is already absolute, return as is
  if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
  return joinUrl(base, maybeUrl);
}
