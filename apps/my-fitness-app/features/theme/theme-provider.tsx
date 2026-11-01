"use client";

import { type ReactNode, useEffect } from "react";

import { useUserConfigStore } from "@shared/runtime/user";
import { ThemeProvider } from "@shared/ui/theme";

const themeColor = { dark: "#010d1a", light: "#f4f7fb" } as const;

export function FitnessTheme({ children }: { children: ReactNode }) {
  useEffect(() => {
    const paint = () => {
      const mode = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor[mode]);
    };
    paint();
    return useUserConfigStore.subscribe((state, previous) => {
      if (state.activeMode !== previous.activeMode) paint();
    });
  }, []);

  return (
    <ThemeProvider accent="cyan" defaultTheme="dark" storageKey="fitness-os-theme">
      {children}
    </ThemeProvider>
  );
}
