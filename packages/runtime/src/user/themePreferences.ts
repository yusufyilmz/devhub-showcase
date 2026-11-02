export const themePreferenceOptions = {
  accent: ["cyan", "violet", "emerald"],
  animation: ["none", "base", "smooth", "bouncy", "elastic"],
  blur: ["none", "soft", "medium", "strong", "extra", "huge", "gigantic"],
  border: ["none", "thin", "base", "thick", "moderate"],
  brand: [
    "white",
    "sand",
    "gray",
    "slate",
    "red",
    "orange",
    "yellow",
    "moss",
    "green",
    "emerald",
    "aqua",
    "cyan",
    "blue",
    "indigo",
    "violet",
    "magenta",
    "pink",
  ],
  container: ["small", "medium", "large"],
  font: ["sans", "serif", "mono"],
  "font-size": ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
  gradient: ["none", "subtle", "vivid"],
  "line-height": ["none", "tight", "snug", "normal", "relaxed", "loose"],
  opacity: ["none", "soft", "medium", "strong"],
  perspective: ["flat", "normal", "dramatic"],
  radius: ["none", "square", "small", "base", "moderate", "rounded", "pill", "circle"],
  scale: ["small", "base", "large", "90", "95", "100", "105", "110", "120"],
  shadow: ["none", "soft", "subtle", "medium", "strong", "deep"],
  spacing: ["compact", "comfortable", "relaxed", "spacious", "cozy", "wide", "extra"],
  tracking: ["tight", "wide"],
  transition: ["none", "base", "smooth", "bouncy", "elastic"],
  weight: ["light", "normal", "medium", "semibold", "bold"],
} as const;

export type ThemePreferences = Partial<Record<keyof typeof themePreferenceOptions, string>>;

export const themePreferenceAliases: Record<string, Record<string, string>> = {
  animation: { base: "smooth", elastic: "bouncy" },
  border: { moderate: "base" },
  radius: { circle: "pill", moderate: "base", none: "square" },
  shadow: { deep: "strong" },
  spacing: { cozy: "relaxed", extra: "spacious" },
  transition: { elastic: "bouncy" },
};

export function cleanThemePreferences(value: unknown): ThemePreferences {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, entry]) =>
        Object.hasOwn(themePreferenceOptions, key) &&
        typeof entry === "string" &&
        (
          themePreferenceOptions[key as keyof typeof themePreferenceOptions] as readonly string[]
        ).includes(entry),
    ),
  );
}

export function readLegacyThemePreferences(): ThemePreferences {
  try {
    const legacy = JSON.parse(localStorage.getItem("ui-theme") ?? "null")?.state ?? {};
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(themePreferenceOptions)) {
      const alias =
        (
          { border: "borders", "font-size": "fontSize", "line-height": "lineHeight" } as Record<
            string,
            string
          >
        )[key] ?? key;
      result[key] = localStorage.getItem(`data-${key}`) ?? legacy[alias];
    }
    return cleanThemePreferences(result);
  } catch {
    return {};
  }
}
