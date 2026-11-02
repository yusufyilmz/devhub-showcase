import type { CSSProperties, ReactNode } from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipVariant = "default" | "dark" | "light" | "gradient" | "minimal";

export interface AnimatedTooltipProps {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  content: ReactNode;
  contentClassName?: string;
  delay?: number;
  disabled?: boolean;
  followCursor?: boolean;
  offset?: number;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
}

export type TooltipShiftOptions = "x" | "y";

export type AnimatedTooltipInlineStyle1Values = [CSSProperties, CSSProperties["color"]];
