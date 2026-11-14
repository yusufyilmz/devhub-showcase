import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getThemePalette, portfolioThemes } from "@shared/config";
import { themeOptions } from "@shared/config/theme";
export const themeToggleStyles = {
  element1:
    "theme-toggle [display:grid] [flex:0_0_auto] [place-items:center] [width:40px] [height:40px] [font-size:22px] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:50%] [transition:border-color_160ms] hover:[border-color:var(--primary)] [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:36px] [padding:8px_10px] [font-size:11px] [color:var(--accent)] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:8px] hover:[background:var(--accent-soft)] [border-color:var(--accent)] max-[700px]:[&_span]:[display:none] max-[700px]:[min-width:36px]",
} as const;

export const preferenceGroups = (
  Object.keys(themeOptions) as Array<keyof typeof themeOptions>
).filter((key) => key !== "accent" && key !== "theme");
const preferenceNames: Record<string, string> = {
  brand: "Palette",
  companion: "Companion",
  font: "Font",
  mono: "Monospace",
  "portfolio-theme": "Theme",
  radius: "Corners",
  sans: "Geist Sans",
  serif: "Editorial Serif",
};
export const appearanceSections = [
  {
    keys: ["portfolio-theme", "brand", "companion", "gradient"] as const,
    label: "Color",
  },
  {
    keys: ["font", "weight", "tracking"] as const,
    label: "Font",
  },
  {
    keys: ["font-size", "line-height", "scale", "spacing", "radius", "container"] as const,
    label: "Size",
  },
  {
    keys: ["border", "shadow", "blur", "opacity"] as const,
    label: "Surface",
  },
  {
    keys: ["animation", "transition", "perspective"] as const,
    label: "Motion",
  },
] as const;
export const appearanceLabel = (value: string) =>
  preferenceNames[value] ?? (value.charAt(0).toUpperCase() + value.slice(1)).replaceAll("-", " ");
export function appearanceSample(key: string, value: string) {
  if (!value) return "↺";
  if (key === "accent" || key === "brand" || key === "companion") return "";
  if (
    key === "portfolio-theme" ||
    ["font", "font-size", "weight", "tracking", "line-height"].includes(key)
  )
    return "Aa";
  return "▰ ▰";
}
export function appearancePreviewStyle(key: string, value: string, index: number): CSSProperties {
  const colors = key === "brand" || key === "accent" || key === "companion";
  const theme =
    key === "portfolio-theme" ? portfolioThemes.find((item) => item.id === value) : undefined;
  const palette = theme ? getThemePalette(theme.id, theme.swatch) : undefined;
  const channel = (part: string) => `rgb(${part.replaceAll(" ", ", ")})`;
  return {
    "--preview-rank": index,
    ...(colors && value
      ? {
          background:
            value === "white" ? "var(--clr-white)" : `var(--clr-${value}-600, var(--primary))`,
        }
      : {}),
    ...(palette && theme
      ? {
          background: channel(palette.surface),
          borderRadius: getPortfolioThemeVariables(theme.id)["--portfolio-radius"],
          color: channel(palette.text),
          fontFamily: getPortfolioThemeVariables(theme.id)["--portfolio-display"],
        }
      : {}),
    ...(key === "weight"
      ? {
          fontWeight: (
            { bold: 700, light: 300, medium: 500, normal: 400, semibold: 600 } as Record<
              string,
              number
            >
          )[value],
        }
      : {}),
    ...(key === "font-size" ? { fontSize: Math.min(12 + index * 2, 30) } : {}),
  } as CSSProperties;
}
export function companionAccentValue(value: string) {
  return value === "white" ? "var(--clr-white)" : `var(--clr-${value}-600)`;
}
