"use client";
import "./preferences.css";

import { useEffect, useRef, useState } from "react";

import {
  completeUserConfigMigration,
  readLegacyThemePreferences,
  readLegacyUserConfig,
  themePreferenceAliases,
  USER_CONFIG_STORAGE_KEY,
  type UserConfigMode,
  useUserConfigStore,
} from "@shared/runtime/user";

import "./store";
import { ThemeContext } from "./theme-toggle";
import type { ResolvedTheme, ThemeProviderOptions } from "./types";

function resolveTheme(theme: UserConfigMode): ResolvedTheme {
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
  const preferences = useUserConfigStore.getState().themePreferences;
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

function applyAppearance(root: HTMLElement, defaults: Record<string, string | null>) {
  const preferences = useUserConfigStore.getState().themePreferences;
  for (const [key, value] of Object.entries(preferences)) {
    if (!(key in defaults)) defaults[key] = root.getAttribute(attributeName(key));
    if (value) root.setAttribute(attributeName(key), value);
  }
  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in preferences)) {
      if (value === null) root.removeAttribute(attributeName(key));
      else root.setAttribute(attributeName(key), value);
    }
  }
  applyAliases(root);
}

export function ThemeProvider({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
}: ThemeProviderOptions) {
  const [mode, setMode] = useState<ResolvedTheme>(defaultTheme === "light" ? "light" : "dark");
  const defaultsRef = useRef<Record<string, string | null> | null>(null);
  useEffect(() => {
    void useUserConfigStore.persist.rehydrate();
    const legacy = readLegacyUserConfig(storageKey);
    if (!Object.keys(useUserConfigStore.getState().themePreferences).length) {
      useUserConfigStore.getState().setThemePreferences(readLegacyThemePreferences());
    }
    if (!useUserConfigStore.getState().activeMode) {
      useUserConfigStore.getState().setActiveMode(legacy.mode ?? defaultTheme);
      if (!useUserConfigStore.getState().user && legacy.user)
        useUserConfigStore.getState().setUser(legacy.user);
    }
    completeUserConfigMigration();
    const root = document.documentElement;
    const defaults = defaultsRef.current ?? readAppearanceDefaults(root);
    defaultsRef.current = defaults;
    defaults.accent = accent;
    const apply = () => {
      const resolved = resolveTheme(useUserConfigStore.getState().activeMode ?? defaultTheme);
      setMode(resolved);
      root.dataset.theme = resolved;
      root.classList.toggle("dark", resolved === "dark");
      applyAppearance(root, defaults);
    };
    root.dataset.accent = accent;
    apply();
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
    const unsubscribe = useUserConfigStore.subscribe((state, previous) => {
      if (
        state.activeMode !== previous.activeMode ||
        state.themePreferences !== previous.themePreferences
      )
        apply();
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== USER_CONFIG_STORAGE_KEY && event.key !== null) return;
      if (!event.newValue)
        useUserConfigStore.setState({ activeMode: null, themePreferences: {}, user: null });
      else void useUserConfigStore.persist.rehydrate();
    };
    media.addEventListener("change", apply);
    window.addEventListener("storage", syncStorage);
    return () => {
      unsubscribe();
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", syncStorage);
    };
  }, [accent, defaultTheme, portfolioTheme, storageKey]);
  const toggle = () =>
    useUserConfigStore.getState().setActiveMode(mode === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}
