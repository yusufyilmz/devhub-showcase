import { themeOptions } from "@shared/config/theme";

export type ThemePreferences = Partial<Record<keyof typeof themeOptions, string>>;

export const themePreferenceAliases: Record<string, Record<string, string>> = {
  animation: { base: "smooth", elastic: "bouncy" },
  border: { moderate: "base" },
  radius: { circle: "pill", moderate: "base", none: "square" },
  shadow: { deep: "strong" },
  spacing: { cozy: "spacious", extra: "spacious", relaxed: "spacious", wide: "spacious" },
  transition: { elastic: "bouncy" },
};

export function cleanThemePreferences(value: unknown): ThemePreferences {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(
        ([key, entry]) =>
          [
            key,
            key === "spacing" &&
            typeof entry === "string" &&
            Object.hasOwn(themePreferenceAliases.spacing ?? {}, entry)
              ? themePreferenceAliases.spacing?.[entry]
              : entry,
          ] as const,
      )
      .filter(
        ([key, entry]) =>
          Object.hasOwn(themeOptions, key) &&
          typeof entry === "string" &&
          (themeOptions[key as keyof typeof themeOptions] as readonly string[]).includes(entry),
      ),
  );
}
