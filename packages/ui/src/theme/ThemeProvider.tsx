"use client";
import "./preferences.css";

import { useEffect, useRef, useState } from "react";

import { type ThemeMode, themePreferenceAliases, themeStorage } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

import "./store";
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

function applyAppearance(root: HTMLElement, defaults: Record<string, string | null>) {
  const preferences = useThemeStore.getState().themePreferences;
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
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
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
