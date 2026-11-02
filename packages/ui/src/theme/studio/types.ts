import type { ColorMode, PortfolioProfile, PortfolioTheme } from "@shared/config";

export type Accent = NonNullable<PortfolioProfile["appearance"]>["accent"];

export type ThemePickerOptions = {
  value: PortfolioTheme;
  accent: Accent;
  mode: ColorMode;
  onChange: (value: PortfolioTheme) => void;
};

export type ThemePreviewOptions = { profile: PortfolioProfile; mode: ColorMode };

export type AppearanceEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
