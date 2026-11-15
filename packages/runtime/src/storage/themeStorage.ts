import { getPortfolioThemeVariables, portfolioThemes } from "@shared/config";
import { storage } from "@shared/config/storage";
import { themeOptions } from "@shared/config/theme";

import { accountPreferenceSession } from "./accountPreferenceSession";
import { localStorageBase, versionedStorage } from "./browserStorage";
import { type ThemePreferences, themePreferenceAliases } from "./themePreferences";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeSettings = { activeMode: ThemeMode | null; themePreferences: ThemePreferences };

const browserTheme = versionedStorage<ThemeSettings>(localStorageBase, storage.theme);
export const themeStorage = {
  ...browserTheme,
  storage: {
    ...browserTheme.storage,
    setItem: (...args: Parameters<typeof browserTheme.storage.setItem>) => {
      if (!accountPreferenceSession.active()) browserTheme.storage.setItem(...args);
    },
  },
};

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

/** Apply validated preferences before the browser paints the document. */
export function themeBootstrapScript(fallback: ThemeMode) {
  return `(() => {
    const root = document.documentElement;
    let state;
    try {
      const record = JSON.parse(localStorage.getItem(${JSON.stringify(themeStorage.name)}) || "null");
      if (record?.version === ${storage.version}) state = record.state;
    } catch {}
    let mode = state?.activeMode;
    if (!["light", "dark", "system"].includes(mode)) mode = ${JSON.stringify(fallback)};
    const resolved = mode === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    root.dataset.theme = resolved;
    root.classList.toggle("dark", resolved === "dark");
    const preferences = state?.themePreferences ?? {};
    const options = ${JSON.stringify(themeOptions)};
    const aliases = ${JSON.stringify(themePreferenceAliases)};
    const portfolioThemes = ${JSON.stringify(
      Object.fromEntries(
        portfolioThemes.map((theme) => [theme.id, getPortfolioThemeVariables(theme.id)]),
      ),
    )};
    const defaults = {};
    for (const key of Object.keys(options)) {
      if (key === "theme") continue;
      const value = preferences[key];
      const alias = Object.hasOwn(aliases[key] ?? {}, value) ? aliases[key][value] : undefined;
      if (!options[key].includes(value) && !(key === "spacing" && options[key].includes(alias))) continue;
      if (key === "brand") {
        root.dataset.accent = value;
        continue;
      }
      if (key === "portfolio-theme") {
        defaults[key] = root.getAttribute("data-portfolio-theme");
        root.dataset.portfolioTheme = value;
        for (const [name, variable] of Object.entries(portfolioThemes[value])) {
          root.style.setProperty(name, variable);
        }
        continue;
      }
      if (key === "companion") {
        defaults[key] = root.getAttribute("data-companion");
        root.dataset.companion = value;
        root.style.setProperty(
          "--companion-accent",
          value === "white" ? "var(--clr-white)" : "var(--clr-" + value + "-600)",
        );
        continue;
      }
      const attribute = "data-" + (key === "container" ? "container-size" : key);
      defaults[key] = root.getAttribute(attribute);
      root.setAttribute(attribute, alias ?? value);
      if (key === "scale" && Number.isFinite(Number(value))) {
        root.style.setProperty("--text-scale", String(Number(value) / 100));
      }
    }
    root.dataset.appearanceDefaults = JSON.stringify(defaults);
  })();`;
}
