import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent, type PortfolioTheme } from "@shared/config";

import type { Accent } from "./types";

export function themePreviewStyle(theme: PortfolioTheme, accent: Accent): CSSProperties {
  return {
    ...getPortfolioThemeVariables(theme),
    ...getPreviewAccent(accent),
  } as CSSProperties;
}

export const themePickerStyles = {
  element1: "theme-picker",
  element2: "theme-picker-grid",
  element3: "theme-choice",
  element4: "theme-preview theme-thumbnail",
  element5: "theme-mini-cards",
} as const;

export const themePreviewStyles = {
  element1: "theme-preview",
  element2: "folio-eyebrow",
  element3: "theme-preview-title",
  element4: "theme-preview-role",
  element5: "theme-preview-summary",
  element6: "theme-preview-card",
} as const;

export const appearanceEditorStyles = {
  element1: "editor-section-heading",
  element2: "eyebrow",
  element3: "editor-card",
  element4: "editor-fields",
  element5: "theme-preview-tools",
  element6: "theme-preview-modes",
  element7: "sr-only",
  element8: "theme-preview-note",
} as const;
