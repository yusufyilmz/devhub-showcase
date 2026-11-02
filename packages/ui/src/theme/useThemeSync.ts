"use client";

import type { UiThemeSyncOptions } from "./types";

export type { UiThemeSyncOptions } from "./types";

import { useEffect } from "react";

import { themeStore } from "./store";

export function useUiThemeSync({ target }: UiThemeSyncOptions = {}) {
  const settings = themeStore((state) => ({
    border: state.borders,
    brand: state.brand,
    scale: state.scale,
    shadow: state.shadow,
    spacing: state.spacing,
    theme: state.theme,
  }));

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const element = target ?? document.documentElement;
    if (!element) {
      return;
    }

    const nextAttributes: Record<string, string> = {
      "data-border": settings.border,
      "data-brand": settings.brand,
      "data-scale": settings.scale,
      "data-shadow": settings.shadow,
      "data-spacing": settings.spacing,
      "data-theme": settings.theme,
    };

    for (const [attribute, value] of Object.entries(nextAttributes)) {
      if (element.getAttribute(attribute) !== value) {
        element.setAttribute(attribute, value);
      }
    }
  }, [settings, target]);
}
