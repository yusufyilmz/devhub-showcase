import type { PageAppearance } from "./types";

export type { PageAppearance } from "./types";

import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent, type PortfolioTheme } from "@shared/config";

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
