"use client";

import { useEffect, useState } from "react";

import { ThemeContext } from "./theme-toggle";

type ResolvedTheme = "light" | "dark";

function resolveTheme(stored: string | null, fallback: "system" | "light" | "dark"): ResolvedTheme {
  if (stored === "light" || stored === "dark") return stored;
  if (fallback === "light") return "light";
  if (fallback === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
  defaultTheme: "system" | "light" | "dark";
  portfolioTheme?: string;
  storageKey: string;
}) {
  const [mode, setMode] = useState<ResolvedTheme>(defaultTheme === "light" ? "light" : "dark");

  useEffect(() => {
    const next = resolveTheme(localStorage.getItem(storageKey), defaultTheme);
    setMode(next);
    const root = document.documentElement;
    root.dataset.theme = next;
    root.dataset.accent = accent;
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
  }, [accent, defaultTheme, portfolioTheme, storageKey]);

  const toggle = () => {
    setMode((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  };

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}
