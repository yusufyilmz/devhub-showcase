import { getExampleForPath } from "@shared/assistant/examples-data";
import { storage } from "@shared/config";
import type { ProfileSnapshot } from "@shared/lib/profile";

function profileStorageKey(id: string | undefined) {
  return id && id !== "main" ? `${storage.theme}:${id}` : storage.theme;
}
export function getPagePresentation(
  path: string,
  platform: boolean,
  snapshot: ProfileSnapshot | null,
) {
  const example = getExampleForPath(path);
  const profile = example?.profile ?? snapshot?.profile;
  const editing = path.startsWith("/admin") || path.endsWith("/edit");
  const appearance = (editing ? undefined : profile?.appearance) ?? {
    accent: "cyan" as const,
    defaultTheme: "light" as const,
  };
  const storageKey = example
    ? `${storage.theme}:example-theme:${example.slug}`
    : platform || !snapshot
      ? storage.theme
      : profileStorageKey(snapshot.id);
  return {
    appearance,
    documentLanguage: editing ? "en" : (profile?.portfolioLanguage ?? "en"),
    example,
    portfolioTheme:
      (platform && !example) || editing ? undefined : (profile?.appearance?.theme ?? "studio"),
    profile,
    storageKey,
  };
}
