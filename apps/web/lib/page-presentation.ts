import type { ProfileSnapshot } from "@shared/lib/profile-errors";
import { getExampleForPath } from "../features/examples/data";

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
    defaultTheme: "dark" as const,
  };
  const storageKey = example
    ? `mydevstudio-example-theme:${example.slug}`
    : platform || !snapshot
      ? "mydevstudio-theme"
      : profileStorageKey(snapshot.id);
  return {
    example,
    profile,
    appearance,
    storageKey,
    documentLanguage: editing ? "en" : (profile?.portfolioLanguage ?? "en"),
    portfolioTheme:
      (platform && !example) || editing
        ? undefined
        : (appearance.theme ?? "studio"),
  };
}
