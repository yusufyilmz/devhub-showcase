import { storage } from "@shared/config/storage";
import { themeOptions } from "@shared/config/theme";

import { localStorageBase, versionedStorage } from "./browserStorage";
import {
  type ThemePreferences,
  themePreferenceAliases,
} from "./themePreferences";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeSettings = { activeMode: ThemeMode | null; themePreferences: ThemePreferences };

export const themeStorage = versionedStorage<ThemeSettings>(localStorageBase, storage.theme);

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
    const defaults = {};
    for (const key of Object.keys(options)) {
      const value = preferences[key];
      if (!options[key].includes(value)) continue;
      const attribute = "data-" + (key === "container" ? "container-size" : key);
      defaults[key] = root.getAttribute(attribute);
      root.setAttribute(attribute, aliases[key]?.[value] ?? value);
      if (key === "scale" && Number.isFinite(Number(value))) {
        root.style.setProperty("--text-scale", String(Number(value) / 100));
      }
    }
    root.dataset.appearanceDefaults = JSON.stringify(defaults);
  })();`;
}
