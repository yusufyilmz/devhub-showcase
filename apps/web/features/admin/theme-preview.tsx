"use client";
import { type ColorMode, getPortfolioCopy, type PortfolioProfile } from "@shared/content";

import { themePreviewStyle } from "./theme-picker";

export function ThemePreview({ profile, mode }: { profile: PortfolioProfile; mode: ColorMode }) {
  const theme = profile.appearance?.theme ?? "studio";
  const accent = profile.appearance?.accent ?? "cyan";
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <section
      aria-label="Portfolio theme preview"
      className="theme-preview"
      data-portfolio-theme={theme}
      data-theme={mode}
      style={themePreviewStyle(theme, accent)}
    >
      <p className="folio-eyebrow">{profile.location}</p>
      <h3 className="theme-preview-title">{profile.name}</h3>
      <p className="theme-preview-role">{profile.title}</p>
      <p className="theme-preview-summary">{profile.summary}</p>
      <div className="theme-preview-card">
        <strong>{text.experience}</strong>
        <p>{profile.experiences[0]?.position ?? "Your experience will appear here."}</p>
      </div>
    </section>
  );
}
