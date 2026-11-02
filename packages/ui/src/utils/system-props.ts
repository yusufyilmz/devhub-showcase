/**
 * System Props - MUI-like spacing, color, and layout props
 *
 * Provides a consistent API across all components for:
 * - Spacing (m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py)
 * - Colors (background, textColor, borderColor)
 * - Layout (width, height, maxWidth, maxHeight, minWidth, minHeight)
 * - Display (display, overflow, position)
 */

import type {
  BorderProps,
  ColorProps,
  ColorValue,
  DisplayProps,
  LayoutProps,
  SizeValue,
  SpacingProps,
  SpacingValue,
  SystemProps,
  TypographyProps,
  VisualProps,
} from "./types";

export type {
  BorderProps,
  ColorProps,
  ColorValue,
  DisplayProps,
  LayoutProps,
  SizeValue,
  SpacingProps,
  SpacingValue,
  SystemProps,
  TypographyProps,
  VisualProps,
} from "./types";

import type { CSSProperties } from "react";

// ============================================================================
// Types
// ============================================================================

/**
 * Spacing props (margin and padding)
 */

/**
 * Color props
 */

/**
 * Layout props
 */

/**
 * Display props
 */

/**
 * Border props (width, style, color)
 */

/**
 * Visual props (radius, shadow, blur, opacity)
 */

/**
 * Typography props (font family, size, weight, line height, letter spacing)
 */

/**
 * All system props combined
 */

// ============================================================================
// Converters
// ============================================================================

/**
 * Convert spacing value to CSS value with scale factor
 * Supports:
 * - Numbers: 0-10 (maps to spacing scale)
 * - 'auto': CSS auto
 */
export function getSpacingValue(value: SpacingValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value === "auto") return "auto";

  // Map number to spacing scale
  const spacingMap: Record<number, string> = {
    0: "0",
    1: "calc(var(--spacing-xs) * var(--scale-factor))", // 6px
    2: "calc(var(--spacing-s) * var(--scale-factor))", // 12px
    3: "calc(var(--spacing-sm) * var(--scale-factor))", // 16px
    4: "calc(var(--spacing-md) * var(--scale-factor))", // 24px
    5: "calc(var(--spacing-lg) * var(--scale-factor))", // 32px
    6: "calc(var(--spacing-xl) * var(--scale-factor))", // 40px
    7: "calc(var(--spacing-2xl) * var(--scale-factor))", // 56px
    8: "calc(var(--spacing-3xl) * var(--scale-factor))", // 72px
    9: "calc(var(--spacing-4xl) * var(--scale-factor))", // 96px (if you add it)
    10: "calc(var(--spacing-5xl) * var(--scale-factor))", // 120px (if you add it)
  };

  return spacingMap[value] || "0";
}

/**
 * Convert color value to CSS variable
 * Handles both palette colors (e.g., 'blue-500') and semantic colors (e.g., 'primary')
 */
export function getColorValue(color: ColorValue | undefined): string | undefined {
  if (!color) return undefined;

  // Semantic colors (use --varName directly)
  const semanticColors = [
    "foreground",
    "background",
    "muted",
    "muted-foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "border",
    "input",
    "ring",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "success",
    "success-foreground",
    "warning",
    "warning-foreground",
    "info",
    "info-foreground",
  ];

  if (semanticColors.includes(color)) {
    return `var(--${color})`;
  }

  // Palette colors (use --clr-varName)
  return `var(--clr-${color.replace("-", "-")})`;
}

/**
 * Convert size value to CSS value
 * Supports:
 * - Numbers: treated as rem
 * - Strings: passed through (e.g., '100%', '50vh', '300px')
 */
export function getSizeValue(value: SizeValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}rem`;
  return value;
}

/**
 * Convert spacing props to CSS styles
 */
export function convertSpacingProps(props: SpacingProps): CSSProperties {
  const styles: CSSProperties = {};

  // Margin
  if (props.m !== undefined) {
    styles.margin = getSpacingValue(props.m);
  }
  if (props.mx !== undefined) {
    styles.marginLeft = getSpacingValue(props.mx);
    styles.marginRight = getSpacingValue(props.mx);
  }
  if (props.my !== undefined) {
    styles.marginTop = getSpacingValue(props.my);
    styles.marginBottom = getSpacingValue(props.my);
  }
  if (props.mt !== undefined) styles.marginTop = getSpacingValue(props.mt);
  if (props.mr !== undefined) styles.marginRight = getSpacingValue(props.mr);
  if (props.mb !== undefined) styles.marginBottom = getSpacingValue(props.mb);
  if (props.ml !== undefined) styles.marginLeft = getSpacingValue(props.ml);

  // Padding
  if (props.p !== undefined) {
    styles.padding = getSpacingValue(props.p);
  }
  if (props.px !== undefined) {
    styles.paddingLeft = getSpacingValue(props.px);
    styles.paddingRight = getSpacingValue(props.px);
  }
  if (props.py !== undefined) {
    styles.paddingTop = getSpacingValue(props.py);
    styles.paddingBottom = getSpacingValue(props.py);
  }
  if (props.pt !== undefined) styles.paddingTop = getSpacingValue(props.pt);
  if (props.pr !== undefined) styles.paddingRight = getSpacingValue(props.pr);
  if (props.pb !== undefined) styles.paddingBottom = getSpacingValue(props.pb);
  if (props.pl !== undefined) styles.paddingLeft = getSpacingValue(props.pl);

  return styles;
}

/**
 * Convert color props to CSS styles
 */
export function convertColorProps(props: ColorProps): CSSProperties {
  const styles: CSSProperties = {};

  if (props.background) {
    styles.backgroundColor = getColorValue(props.background);
  }
  if (props.textColor) {
    styles.color = getColorValue(props.textColor);
  }
  if (props.borderColor) {
    styles.borderColor = getColorValue(props.borderColor);
  }

  return styles;
}

/**
 * Convert layout props to CSS styles
 */
export function convertLayoutProps(props: LayoutProps): CSSProperties {
  const styles: CSSProperties = {};

  if (props.width !== undefined) styles.width = getSizeValue(props.width);
  if (props.height !== undefined) styles.height = getSizeValue(props.height);
  if (props.maxWidth !== undefined) styles.maxWidth = getSizeValue(props.maxWidth);
  if (props.maxHeight !== undefined) styles.maxHeight = getSizeValue(props.maxHeight);
  if (props.minWidth !== undefined) styles.minWidth = getSizeValue(props.minWidth);
  if (props.minHeight !== undefined) styles.minHeight = getSizeValue(props.minHeight);

  return styles;
}

/**
 * Convert display props to CSS styles
 */
export function convertDisplayProps(props: DisplayProps): CSSProperties {
  const styles: CSSProperties = {};

  if (props.display) styles.display = props.display;
  if (props.overflow) styles.overflow = props.overflow;
  if (props.position) styles.position = props.position;

  return styles;
}

/**
 * Convert border width value to CSS value
 * 'default' uses --border-width from theme, numbers are converted to px
 */
function getBorderWidth(value: "default" | 0 | 1 | 2 | 4 | 6 | 8 | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value === "default") return "var(--border-width)";
  return `${value}px`;
}

/**
 * Convert border props to CSS styles
 */
export function convertBorderProps(props: BorderProps): CSSProperties {
  const styles: CSSProperties = {};

  // Border width
  if (props.border !== undefined) {
    styles.borderWidth = getBorderWidth(props.border);
  }
  if (props.borderX !== undefined) {
    const width = getBorderWidth(props.borderX);
    styles.borderLeftWidth = width;
    styles.borderRightWidth = width;
  }
  if (props.borderY !== undefined) {
    const width = getBorderWidth(props.borderY);
    styles.borderTopWidth = width;
    styles.borderBottomWidth = width;
  }
  if (props.borderTop !== undefined) styles.borderTopWidth = getBorderWidth(props.borderTop);
  if (props.borderRight !== undefined) styles.borderRightWidth = getBorderWidth(props.borderRight);
  if (props.borderBottom !== undefined)
    styles.borderBottomWidth = getBorderWidth(props.borderBottom);
  if (props.borderLeft !== undefined) styles.borderLeftWidth = getBorderWidth(props.borderLeft);

  // Border style - default to solid if any border width is set
  if (props.borderStyle) {
    styles.borderStyle = props.borderStyle;
  } else if (
    props.border ||
    props.borderTop ||
    props.borderRight ||
    props.borderBottom ||
    props.borderLeft ||
    props.borderX ||
    props.borderY
  ) {
    styles.borderStyle = "solid";
  }

  // Border color - defaults to --border from theme if not specified
  if (props.borderColor) {
    styles.borderColor = getColorValue(props.borderColor);
  } else if (
    props.border ||
    props.borderTop ||
    props.borderRight ||
    props.borderBottom ||
    props.borderLeft ||
    props.borderX ||
    props.borderY
  ) {
    styles.borderColor = "var(--border)";
  }

  return styles;
}

/**
 * Convert visual props to CSS styles
 */
export function convertVisualProps(props: VisualProps): CSSProperties {
  const styles: CSSProperties = {};

  // Border radius - using CSS variables
  if (props.radius) {
    const radiusMap = {
      "2xl": "calc(var(--radius-2xl, 24px) * var(--scale-factor))",
      full: "var(--radius-full)",
      lg: "calc(var(--radius-lg) * var(--scale-factor))",
      md: "calc(var(--radius-m) * var(--scale-factor))",
      none: "0",
      sm: "calc(var(--radius-s) * var(--scale-factor))",
      xl: "calc(var(--radius-xl) * var(--scale-factor))",
    };
    styles.borderRadius = radiusMap[props.radius];
  }

  // Box shadow - using CSS variables
  if (props.shadow) {
    const shadowMap = {
      "2xl": "var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))",
      inner: "var(--shadow-inner, inset 0 2px 4px 0 rgba(0, 0, 0, 0.06))",
      lg: "var(--shadow-lg)",
      md: "var(--shadow-md)",
      none: "none",
      sm: "var(--shadow-s)",
      xl: "var(--shadow-xl)",
      xs: "var(--shadow-xs)",
    };
    styles.boxShadow = shadowMap[props.shadow];
  }

  // Backdrop blur - using CSS variables
  if (props.blur) {
    const blurMap = {
      "2xl": "var(--blur-2xl, blur(40px))",
      "3xl": "var(--blur-3xl, blur(64px))",
      lg: "var(--blur-lg, blur(16px))",
      md: "var(--blur-md, blur(12px))",
      none: "none",
      sm: "var(--blur-sm, blur(4px))",
      xl: "var(--blur-xl, blur(24px))",
    };
    styles.backdropFilter = blurMap[props.blur];
  }

  // Opacity
  if (props.opacity !== undefined) {
    styles.opacity = props.opacity / 100;
  }

  return styles;
}

/**
 * Convert typography props to CSS styles
 */
export function convertTypographyProps(props: TypographyProps): CSSProperties {
  const styles: CSSProperties = {};

  // Font family
  if (props.fontFamily) {
    const fontFamilyMap = {
      mono: "var(--font-mono)",
      sans: "var(--font-sans)",
      serif: "var(--font-serif, Georgia, serif)",
    };
    styles.fontFamily = fontFamilyMap[props.fontFamily];
  }

  // Font size (respects scale factor)
  if (props.fontSize) {
    const fontSizeMap = {
      "2xl": "calc(var(--font-size-2xl) * var(--scale-factor))",
      "3xl": "calc(var(--font-size-3xl) * var(--scale-factor))",
      "4xl": "calc(var(--font-size-4xl) * var(--scale-factor))",
      "5xl": "calc(var(--font-size-5xl, 3rem) * var(--scale-factor))",
      "6xl": "calc(var(--font-size-6xl, 3.75rem) * var(--scale-factor))",
      base: "calc(var(--font-size-base) * var(--scale-factor))",
      lg: "calc(var(--font-size-lg) * var(--scale-factor))",
      sm: "calc(var(--font-size-sm) * var(--scale-factor))",
      xl: "calc(var(--font-size-xl) * var(--scale-factor))",
      xs: "calc(var(--font-size-xs) * var(--scale-factor))",
    };
    styles.fontSize = fontSizeMap[props.fontSize];
  }

  // Font weight
  if (props.fontWeight) {
    const fontWeightMap = {
      black: "900",
      bold: "700",
      extrabold: "800",
      light: "300",
      medium: "500",
      normal: "400",
      semibold: "600",
      thin: "100",
    };
    styles.fontWeight = fontWeightMap[props.fontWeight];
  }

  // Line height
  if (props.lineHeight) {
    const lineHeightMap = {
      loose: "2",
      none: "1",
      normal: "var(--line-height-normal)",
      relaxed: "var(--line-height-relaxed)",
      snug: "var(--line-height-snug)",
      tight: "var(--line-height-tight)",
    };
    styles.lineHeight = lineHeightMap[props.lineHeight];
  }

  // Letter spacing
  if (props.letterSpacing) {
    const letterSpacingMap = {
      normal: "0",
      tight: "-0.025em",
      tighter: "-0.05em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    };
    styles.letterSpacing = letterSpacingMap[props.letterSpacing];
  }

  // Text align
  if (props.textAlign) {
    styles.textAlign = props.textAlign;
  }

  // Text transform
  if (props.textTransform) {
    styles.textTransform = props.textTransform;
  }

  return styles;
}

/**
 * Convert all system props to CSS styles
 */
export function convertSystemProps(props: SystemProps): CSSProperties {
  return {
    ...convertSpacingProps(props),
    ...convertColorProps(props),
    ...convertLayoutProps(props),
    ...convertDisplayProps(props),
    ...convertBorderProps(props),
    ...convertVisualProps(props),
    ...convertTypographyProps(props),
  };
}

/**
 * Extract system props from component props
 * Returns: [systemProps, otherProps]
 */
export function extractSystemProps<T extends SystemProps>(
  props: T,
): [SystemProps, Omit<T, keyof SystemProps>] {
  const {
    // Spacing
    m,
    mt,
    mr,
    mb,
    ml,
    mx,
    my,
    p,
    pt,
    pr,
    pb,
    pl,
    px,
    py,
    // Colors
    background,
    textColor,
    borderColor,
    // Layout
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    // Display
    display,
    overflow,
    position,
    // Border
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderX,
    borderY,
    borderStyle,
    // Visual
    radius,
    shadow,
    blur,
    opacity,
    // Typography
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textAlign,
    textTransform,
    // Rest
    ...otherProps
  } = props;

  const systemProps: SystemProps = {
    background,
    blur,
    border,
    borderBottom,
    borderColor,
    borderLeft,
    borderRight,
    borderStyle,
    borderTop,
    borderX,
    borderY,
    display,
    fontFamily,
    fontSize,
    fontWeight,
    height,
    letterSpacing,
    lineHeight,
    m,
    maxHeight,
    maxWidth,
    mb,
    minHeight,
    minWidth,
    ml,
    mr,
    mt,
    mx,
    my,
    opacity,
    overflow,
    p,
    pb,
    pl,
    position,
    pr,
    pt,
    px,
    py,
    radius,
    shadow,
    textAlign,
    textColor,
    textTransform,
    width,
  };

  return [systemProps, otherProps as Omit<T, keyof SystemProps>];
}

// ============================================================================
// Spacing Scale Reference (for documentation)
// ============================================================================

/**
 * Spacing scale:
 *
 * 0 = 0
 * 1 = var(--spacing-xs) = 6px (default)
 * 2 = var(--spacing-s) = 12px
 * 3 = var(--spacing-sm) = 16px
 * 4 = var(--spacing-md) = 24px
 * 5 = var(--spacing-lg) = 32px
 * 6 = var(--spacing-xl) = 40px
 * 7 = var(--spacing-2xl) = 56px
 * 8 = var(--spacing-3xl) = 72px
 *
 * All values are multiplied by --scale-factor (0.9 to 1.1)
 *
 * Examples:
 * - m={2} → margin: 12px
 * - mx={4} → marginLeft: 24px, marginRight: 24px
 * - py={3} → paddingTop: 16px, paddingBottom: 16px
 * - mb="auto" → marginBottom: auto
 */
