"use client";
import {
  type ColorMode,
  getPortfolioThemeVariables,
  getPreviewAccent,
  type PortfolioProfile,
  type PortfolioTheme,
  portfolioThemes,
} from "@shared/content";
import type { CSSProperties } from "react";

type Accent = NonNullable<PortfolioProfile["appearance"]>["accent"];
export function themePreviewStyle(
  theme: PortfolioTheme,
  accent: Accent,
): CSSProperties {
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
          <label
            className="theme-choice"
            key={theme.id}
            data-selected={value === theme.id}
          >
            <span
              className="theme-preview theme-thumbnail"
              data-portfolio-theme={theme.id}
              data-theme={mode}
              style={themePreviewStyle(theme.id, accent)}
              aria-hidden="true"
            >
              <b>Aa. Your story.</b>
              <i />
              <span className="theme-mini-cards">
                <i />
                <i />
              </span>
            </span>
            <input
              type="radio"
              name="portfolio-theme"
              value={theme.id}
              checked={value === theme.id}
              onChange={() => onChange(theme.id)}
            />
            <strong>{theme.name}</strong>
            <span>{theme.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
