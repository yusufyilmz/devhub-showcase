"use client";

import { getPortfolioCopy } from "@shared/config";

import { themePreviewStyles } from "./styles";
import { themePreviewStyle } from "./theme-picker";
import type { ThemePreviewOptions } from "./types";

export function ThemePreview({ profile, mode }: ThemePreviewOptions) {
  const theme = profile.appearance?.theme ?? "studio";
  const accent = profile.appearance?.accent ?? "cyan";
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <section
      aria-label="Portfolio theme preview"
      className={themePreviewStyles.element1}
      data-portfolio-theme={theme}
      data-theme={mode}
      style={themePreviewStyle(theme, accent)}
    >
      <p className={themePreviewStyles.element2}>{profile.location}</p>
      <h3 className={themePreviewStyles.element3}>{profile.name}</h3>
      <p className={themePreviewStyles.element4}>{profile.title}</p>
      <p className={themePreviewStyles.element5}>{profile.summary}</p>
      <div className={themePreviewStyles.element6}>
        <strong>{text.experience}</strong>
        <p>{profile.experiences[0]?.position ?? "Your experience will appear here."}</p>
      </div>
    </section>
  );
}
