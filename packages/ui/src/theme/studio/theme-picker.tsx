"use client";

import { portfolioThemes } from "@shared/config";

import { themePickerStyles, themePreviewStyle } from "./styles";
import type { ThemePickerOptions } from "./types";

export function ThemePicker({ value, accent, mode, onChange }: ThemePickerOptions) {
  return (
    <fieldset className={themePickerStyles.element1}>
      <legend>Portfolio theme</legend>
      <div className={themePickerStyles.element2}>
        {portfolioThemes.map((theme) => (
          <label
            className={themePickerStyles.element3}
            data-selected={value === theme.id}
            key={theme.id}
          >
            <span
              aria-hidden="true"
              className={themePickerStyles.element4}
              data-portfolio-theme={theme.id}
              data-theme={mode}
              style={themePreviewStyle(theme.id, accent)}
            >
              <b>Aa. Your story.</b>
              <i />
              <span className={themePickerStyles.element5}>
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

export { themePreviewStyle } from "./styles";
