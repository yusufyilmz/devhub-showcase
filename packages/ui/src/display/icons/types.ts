import type { CSSProperties } from "react";

export type FontSize = "small" | "medium" | "large" | "xlarge";

export interface IconProps {
  className?: string;
  d?: string;
  fontSize?: FontSize;
}

export type IconsInlineStyle1Values = [CSSProperties["height"], CSSProperties["width"]];
