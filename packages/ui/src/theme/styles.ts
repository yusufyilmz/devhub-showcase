import type { CSSProperties } from "react";

import { themeOptions } from "@shared/config/theme";
export const themeToggleStyles = {
  element1: "theme-toggle",
} as const;

export const preferenceGroups = Object.keys(themeOptions) as Array<
  keyof typeof themeOptions
>;
const preferenceNames: Record<string, string> = {
  brand: "Theme",
  font: "Font",
  mono: "Monospace",
  radius: "Corners",
  sans: "Geist Sans",
  serif: "Editorial Serif",
};
export const appearanceLabel = (value: string) =>
  preferenceNames[value] ?? (value.charAt(0).toUpperCase() + value.slice(1)).replaceAll("-", " ");
export function appearanceSample(key: string, value: string) {
  if (!value) return "↺";
  if (key === "accent" || key === "brand") return "";
  if (["font", "font-size", "weight", "tracking", "line-height"].includes(key)) return "Aa";
  return "▰ ▰";
}
export function appearancePreviewStyle(key: string, value: string, index: number): CSSProperties {
  const colors = key === "brand" || key === "accent";
  return {
    "--preview-rank": index,
    ...(colors && value
      ? {
          background:
            value === "white"
              ? "var(--clr-white)"
              : `var(--clr-${value}-600, rgb(var(--accent-rgb)))`,
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
