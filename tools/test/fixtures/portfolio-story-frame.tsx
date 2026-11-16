import "@shared/ui/globals.css";
import "@shared/ui/sections.css";

import type { CSSProperties, ReactNode } from "react";

/** Inherit the Storybook theme so the toolbar controls the actual portfolio colors. */
export function PortfolioStoryFrame({
  children,
  fullBleed = false,
}: {
  children: ReactNode;
  fullBleed?: boolean;
}) {
  const style = {
    background: "var(--background)",
    color: "var(--foreground)",
    minWidth: 0,
    padding: fullBleed ? 0 : "24px",
  } as CSSProperties;
  return <div style={style}>{children}</div>;
}
