export type ColorValue =
  // Palette colors
  | "sand"
  | "gray"
  | "slate"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "cyan"
  | "blue"
  | "violet"
  | "purple"
  | "pink"
  | `${"sand" | "gray" | "slate" | "red" | "orange" | "yellow" | "lime" | "green" | "emerald" | "cyan" | "blue" | "violet" | "purple" | "pink"}-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  // Semantic colors
  | "foreground"
  | "background"
  | "muted"
  | "muted-foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "border"
  | "input"
  | "ring"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "success"
  | "success-foreground"
  | "warning"
  | "warning-foreground"
  | "info"
  | "info-foreground";

export type SpacingValue = number | "auto";

export type SizeValue = number | string;

export interface SpacingProps {
  // Margin
  m?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
  mt?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;

  // Padding
  p?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  pr?: SpacingValue;
  pt?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
}

export interface ColorProps {
  background?: ColorValue;
  borderColor?: ColorValue;
  textColor?: ColorValue;
}

export interface LayoutProps {
  height?: SizeValue;
  maxHeight?: SizeValue;
  maxWidth?: SizeValue;
  minHeight?: SizeValue;
  minWidth?: SizeValue;
  width?: SizeValue;
}

export interface DisplayProps {
  display?: "block" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "none";
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
}

export interface BorderProps {
  // Border width (all sides) - 'default' uses --border-width from theme
  border?: "default" | 0 | 1 | 2 | 4 | 6 | 8;
  borderBottom?: "default" | 0 | 1 | 2 | 4 | 6 | 8;

  // Border color (uses ColorValue for consistency) - defaults to --border from theme
  borderColor?: ColorValue;
  borderLeft?: "default" | 0 | 1 | 2 | 4 | 6 | 8;
  borderRight?: "default" | 0 | 1 | 2 | 4 | 6 | 8;

  // Border style
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  borderTop?: "default" | 0 | 1 | 2 | 4 | 6 | 8;
  borderX?: "default" | 0 | 1 | 2 | 4 | 6 | 8;
  borderY?: "default" | 0 | 1 | 2 | 4 | 6 | 8;
}

export interface VisualProps {
  blur?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  opacity?: number; // 0-100
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  shadow?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
}

export interface TypographyProps {
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  fontWeight?: "thin" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  textAlign?: "left" | "center" | "right" | "justify";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface SystemProps
  extends SpacingProps,
    ColorProps,
    LayoutProps,
    DisplayProps,
    BorderProps,
    VisualProps,
    TypographyProps {}
