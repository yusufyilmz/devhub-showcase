import type { CSSProperties } from "react";

import {
  getPortfolioThemeVariables,
  getPreviewAccent,
  type PortfolioProfile,
  type PortfolioTheme,
} from "@shared/config";

export type PageAppearance = NonNullable<PortfolioProfile["appearance"]>;

export function getPublicThemeStyle(
  theme: PortfolioTheme | undefined,
  accent: PageAppearance["accent"],
): CSSProperties | undefined {
  if (!theme) return undefined;
  return {
    ...getPortfolioThemeVariables(theme),
    ...getPreviewAccent(accent),
  } as CSSProperties;
}
