import "@shared/ui/globals.css";
import "@shared/ui/sections.css";

import type { CSSProperties, ReactNode } from "react";

import type { ColorMode } from "@shared/config";

/** Story canvas uses the same data-theme and data-brand palette as the product. */
export function PortfolioStoryFrame({
  children,
  mode = "light",
  fullBleed = false,
}: {
  children: ReactNode;
  mode?: ColorMode;
  fullBleed?: boolean;
}) {
  const style = {
    background: "var(--background)",
    color: "var(--foreground)",
    minWidth: 0,
    padding: fullBleed ? 0 : "24px",
  } as CSSProperties;
  return (
    <div data-brand="cyan" data-theme={mode} style={style}>
      {children}
    </div>
  );
}
