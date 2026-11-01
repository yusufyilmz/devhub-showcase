"use client";

import { useEffect, useState } from "react";

import { isStorageTheme, type StorageTheme, USER_STORAGE_KEY } from "../stores/storage-theme";
import { useStorage } from "../stores/use-storage";
import { ThemeContext } from "./theme-toggle";

type ResolvedTheme = "light" | "dark";
function resolveTheme(theme: StorageTheme): ResolvedTheme {
  return theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;
}

function legacyTheme(storageKey: string) {
  try {
    const stored = localStorage.getItem("mydevstudio-theme") ?? localStorage.getItem(storageKey);
    return isStorageTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
}: {
  accent: "cyan" | "violet" | "emerald";
  children: React.ReactNode;
  defaultTheme: StorageTheme;
  portfolioTheme?: string;
  /** Read only to migrate a preference written by an older version. */
  storageKey: string;
}) {
  const [mode, setMode] = useState<ResolvedTheme>(defaultTheme === "light" ? "light" : "dark");
  useEffect(() => {
    void useStorage.persist.rehydrate();
    if (!useStorage.getState().theme)
      useStorage.getState().setTheme(legacyTheme(storageKey) ?? defaultTheme);
    const root = document.documentElement;
    const apply = () => {
      const resolved = resolveTheme(useStorage.getState().theme ?? defaultTheme);
      setMode(resolved);
      root.dataset.theme = resolved;
    };
    apply();
    root.dataset.accent = accent;
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
    const unsubscribe = useStorage.subscribe((state, previous) => {
      if (state.theme !== previous.theme) apply();
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== USER_STORAGE_KEY && event.key !== null) return;
      if (!event.newValue) useStorage.setState({ theme: null, user: null });
      else void useStorage.persist.rehydrate();
    };
    media.addEventListener("change", apply);
    window.addEventListener("storage", syncStorage);
    return () => {
      unsubscribe();
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", syncStorage);
    };
  }, [accent, defaultTheme, portfolioTheme, storageKey]);
  const toggle = () => useStorage.getState().setTheme(mode === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}
