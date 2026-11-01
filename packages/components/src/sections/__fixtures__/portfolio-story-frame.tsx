import "@shared/design-system/home.css";
import "@shared/design-system/sections.css";

import type { CSSProperties, ReactNode } from "react";

import { type ColorMode, getThemePalette, portfolioAccents } from "@shared/config";

/** A scoped portfolio palette; never load legacy global resets into primitive stories. */
export function PortfolioStoryFrame({
  children,
  mode = "light",
}: {
  children: ReactNode;
  mode?: ColorMode;
}) {
  const palette = getThemePalette("studio", mode);
  const variables = Object.fromEntries(
    Object.entries(palette).map(([key, value]) => [
      `--${key === "soft" ? "surface-soft" : key}-rgb`,
      value,
    ]),
  );
  const style = {
    ...variables,
    "--accent-rgb": portfolioAccents.cyan[mode],
    background: "rgb(var(--bg-rgb))",
    color: "rgb(var(--text-rgb))",
    padding: "24px",
    minWidth: 0,
  } as CSSProperties;
  return <div style={style}>{children}</div>;
}
