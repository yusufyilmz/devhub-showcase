import type { CSSProperties } from "react";

import {
  getPortfolioThemeVariables,
  getPreviewAccent,
  type PortfolioProfile,
  type PortfolioTheme,
} from "@shared/content";
export function getPublicThemeStyle(
  theme: PortfolioTheme | undefined,
  accent: NonNullable<PortfolioProfile["appearance"]>["accent"],
): CSSProperties | undefined {
  if (!theme) return undefined;
  return {
    ...getPortfolioThemeVariables(theme),
    ...getPreviewAccent(accent),
  } as CSSProperties;
}
