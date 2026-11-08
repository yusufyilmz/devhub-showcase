"use client";
import "./preferences.css";

import { useEffect, useRef, useState } from "react";

import { getPortfolioThemeVariables, type PortfolioTheme, portfolioThemes } from "@shared/config";
import { themeOptions } from "@shared/config/theme";
import { type ThemeMode, themePreferenceAliases, themeStorage } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

import "./store";
import { companionAccentValue } from "./styles";
import { ThemeContext } from "./theme-toggle";
import type { ResolvedTheme, ThemeProviderOptions } from "./types";

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;
}

function attributeName(key: string) {
  return `data-${key === "container" ? "container-size" : key}`;
}

function applyAliases(root: HTMLElement) {
  const preferences = useThemeStore.getState().themePreferences;
  for (const [key, values] of Object.entries(themePreferenceAliases)) {
    const value = preferences[key as keyof typeof preferences];
    if (value && Object.hasOwn(values, value))
      root.setAttribute(attributeName(key), values[value] ?? value);
  }
  if (preferences.scale && /^\d+$/.test(preferences.scale))
    root.style.setProperty("--text-scale", String(Number(preferences.scale) / 100));
  else root.style.removeProperty("--text-scale");
}

function readAppearanceDefaults(root: HTMLElement): Record<string, string | null> {
  try {
    return JSON.parse(root.dataset.appearanceDefaults ?? "{}");
  } catch {
    return {};
  }
}

const accentThemes = new Set<string>(themeOptions.brand);
const portfolioThemeIds = new Set<string>(portfolioThemes.map((theme) => theme.id));
const portfolioVariableNames = Object.keys(getPortfolioThemeVariables());

function rememberPortfolioTheme(root: HTMLElement, defaults: Record<string, string | null>) {
  if ("portfolio-theme" in defaults) return;
  defaults["portfolio-theme"] = root.getAttribute("data-portfolio-theme");
  defaults["portfolio-theme-style"] = JSON.stringify(
    Object.fromEntries(
      portfolioVariableNames.map((name) => [name, root.style.getPropertyValue(name)]),
    ),
  );
}

function writePortfolioTheme(root: HTMLElement, value: string) {
  root.dataset.portfolioTheme = value;
  for (const [name, variable] of Object.entries(
    getPortfolioThemeVariables(value as PortfolioTheme),
  ))
    root.style.setProperty(name, variable);
}

function restorePortfolioTheme(root: HTMLElement, defaults: Record<string, string | null>) {
  const attribute = defaults["portfolio-theme"];
  if (attribute) root.dataset.portfolioTheme = attribute;
  else root.removeAttribute("data-portfolio-theme");
  let saved: Record<string, string> = {};
  try {
    saved = JSON.parse(defaults["portfolio-theme-style"] ?? "{}") as Record<string, string>;
  } catch {
    saved = {};
  }
  for (const name of portfolioVariableNames) {
    const previous = saved[name];
    if (previous) root.style.setProperty(name, previous);
    else root.style.removeProperty(name);
  }
}

function applyPreference(
  root: HTMLElement,
  key: string,
  value: string,
  defaults: Record<string, string | null>,
) {
  if (key === "theme") return;
  if (key === "portfolio-theme" && portfolioThemeIds.has(value)) {
    rememberPortfolioTheme(root, defaults);
    writePortfolioTheme(root, value);
    return;
  }
  if (key === "brand" && accentThemes.has(value)) {
    if (!("brand" in defaults)) defaults.brand = root.getAttribute("data-brand");
    root.dataset.accent = value;
    root.removeAttribute("data-brand");
    return;
  }
  if (key === "companion") {
    if (!("companion" in defaults)) defaults.companion = root.getAttribute("data-companion");
    root.dataset.companion = value;
    root.style.setProperty("--companion-accent", companionAccentValue(value));
    return;
  }
  if (!(key in defaults)) defaults[key] = root.getAttribute(attributeName(key));
  if (value) root.setAttribute(attributeName(key), value);
}

function restoreDefault(
  root: HTMLElement,
  key: string,
  value: string | null,
  defaults: Record<string, string | null>,
  preferences: ReturnType<typeof useThemeStore.getState>["themePreferences"],
) {
  if (key === "portfolio-theme-style") return;
  if (key === "portfolio-theme") {
    restorePortfolioTheme(root, defaults);
    return;
  }
  if (key === "companion") {
    if (value) root.dataset.companion = value;
    else root.removeAttribute("data-companion");
    root.style.removeProperty("--companion-accent");
    return;
  }
  if (key === "accent" && preferences.brand && accentThemes.has(preferences.brand)) return;
  if (value === null) root.removeAttribute(attributeName(key));
  else root.setAttribute(attributeName(key), value);
}

function applyAppearance(root: HTMLElement, defaults: Record<string, string | null>) {
  const preferences = useThemeStore.getState().themePreferences;
  for (const [key, value] of Object.entries(preferences))
    applyPreference(root, key, value, defaults);
  for (const [key, value] of Object.entries(defaults)) {
    if (key in preferences) continue;
    restoreDefault(root, key, value, defaults, preferences);
  }
  applyAliases(root);
}

export function ThemeProvider({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
}: ThemeProviderOptions) {
  const [mode, setMode] = useState<ResolvedTheme>(defaultTheme === "light" ? "light" : "dark");
  const defaultsRef = useRef<Record<string, string | null> | null>(null);
  useEffect(() => {
    if (!useThemeStore.persist.hasHydrated()) useThemeStore.persist.rehydrate();
    const root = document.documentElement;
    const defaults = defaultsRef.current ?? readAppearanceDefaults(root);
    defaultsRef.current = defaults;
    defaults.accent = accent;
    const apply = () => {
      const resolved = resolveTheme(useThemeStore.getState().activeMode ?? defaultTheme);
      setMode(resolved);
      root.dataset.theme = resolved;
      root.classList.toggle("dark", resolved === "dark");
      applyAppearance(root, defaults);
    };
    root.dataset.accent = accent;
    apply();
    const chosenPortfolioTheme = useThemeStore.getState().themePreferences["portfolio-theme"];
    if (!chosenPortfolioTheme) {
      if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
      else delete root.dataset.portfolioTheme;
    }
    const unsubscribe = useThemeStore.subscribe(apply);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncStorage = (event: StorageEvent) => {
      if (event.key === themeStorage.name || event.key === null) useThemeStore.persist.rehydrate();
    };
    media.addEventListener("change", apply);
    window.addEventListener("storage", syncStorage);
    return () => {
      unsubscribe();
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", syncStorage);
    };
  }, [accent, defaultTheme, portfolioTheme]);
  const toggle = () => useThemeStore.getState().setActiveMode(mode === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}
