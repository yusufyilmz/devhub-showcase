"use client";
import type { CSSProperties } from "react";

import {
  type ColorMode,
  getPortfolioThemeVariables,
  getPreviewAccent,
  type PortfolioProfile,
  type PortfolioTheme,
  portfolioThemes,
} from "@shared/content";

type Accent = NonNullable<PortfolioProfile["appearance"]>["accent"];
export function themePreviewStyle(theme: PortfolioTheme, accent: Accent): CSSProperties {
  return {
    ...getPortfolioThemeVariables(theme),
    ...getPreviewAccent(accent),
  } as CSSProperties;
}
export function ThemePicker({
  value,
  accent,
  mode,
  onChange,
}: {
  value: PortfolioTheme;
  accent: Accent;
  mode: ColorMode;
  onChange: (value: PortfolioTheme) => void;
}) {
  return (
    <fieldset className="theme-picker">
      <legend>Portfolio theme</legend>
      <div className="theme-picker-grid">
        {portfolioThemes.map((theme) => (
          <label className="theme-choice" data-selected={value === theme.id} key={theme.id}>
            <span
              aria-hidden="true"
              className="theme-preview theme-thumbnail"
              data-portfolio-theme={theme.id}
              data-theme={mode}
              style={themePreviewStyle(theme.id, accent)}
            >
              <b>Aa. Your story.</b>
              <i />
              <span className="theme-mini-cards">
                <i />
                <i />
              </span>
            </span>
            <input
              checked={value === theme.id}
              name="portfolio-theme"
              onChange={() => onChange(theme.id)}
              type="radio"
              value={theme.id}
            />
            <strong>{theme.name}</strong>
            <span>{theme.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
