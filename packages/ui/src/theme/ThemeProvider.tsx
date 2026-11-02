"use client";

import { useEffect, useState } from "react";

import {
  completeUserConfigMigration,
  readLegacyUserConfig,
  USER_CONFIG_STORAGE_KEY,
  type UserConfigMode,
  useUserConfigStore,
} from "@shared/runtime/user";

import { ThemeContext } from "./theme-toggle";
import type { ResolvedTheme, ThemeProviderOptions } from "./types";

function resolveTheme(theme: UserConfigMode): ResolvedTheme {
  return theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;
}

export function ThemeProvider({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
}: ThemeProviderOptions) {
  const [mode, setMode] = useState<ResolvedTheme>(defaultTheme === "light" ? "light" : "dark");
  useEffect(() => {
    void useUserConfigStore.persist.rehydrate();
    const legacy = readLegacyUserConfig(storageKey);
    if (!useUserConfigStore.getState().activeMode) {
      useUserConfigStore.getState().setActiveMode(legacy.mode ?? defaultTheme);
      if (!useUserConfigStore.getState().user && legacy.user)
        useUserConfigStore.getState().setUser(legacy.user);
    }
    completeUserConfigMigration();
    const root = document.documentElement;
    const apply = () => {
      const resolved = resolveTheme(useUserConfigStore.getState().activeMode ?? defaultTheme);
      setMode(resolved);
      root.dataset.theme = resolved;
    };
    apply();
    root.dataset.accent = accent;
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
    const unsubscribe = useUserConfigStore.subscribe((state, previous) => {
      if (state.activeMode !== previous.activeMode) apply();
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== USER_CONFIG_STORAGE_KEY && event.key !== null) return;
      if (!event.newValue) useUserConfigStore.setState({ activeMode: null, user: null });
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
