import type { ProfileSnapshot } from "@shared/lib/profile-errors";

import { getExampleForPath } from "@/features/studio";

function profileStorageKey(id: string | undefined) {
  return id && id !== "main" ? `devhub-theme:${id}` : "devhub-theme";
}
export function getPagePresentation(
  path: string,
  platform: boolean,
  snapshot: ProfileSnapshot | null,
) {
  const example = getExampleForPath(path);
  const profile = example?.profile ?? snapshot?.profile;
  const editing = path.startsWith("/admin") || path.endsWith("/edit");
  const appearance = profile?.appearance ?? {
    accent: "cyan" as const,
    defaultTheme: "light" as const,
  };
  const storageKey = example
    ? `mydevstudio-example-theme:${example.slug}`
    : platform || !snapshot
      ? "mydevstudio-theme"
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
