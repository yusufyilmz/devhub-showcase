import type { UserConfigMode } from "@shared/runtime/user";

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const BRANDS = [
  "white",
  "sand",
  "gray",
  "slate",
  "red",
  "orange",
  "yellow",
  "moss",
  "green",
  "emerald",
  "aqua",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "magenta",
  "pink",
] as const;
export type Brand = (typeof BRANDS)[number];

export const BORDER_STYLES = ["none", "thin", "base", "thick", "moderate"] as const;
export type BorderStyle = (typeof BORDER_STYLES)[number];

export const SHADOW_STYLES = ["none", "soft", "subtle", "medium", "strong", "deep"] as const;
export type ShadowStyle = (typeof SHADOW_STYLES)[number];

export const SPACING_STYLES = ["compact", "comfortable", "cozy", "wide", "extra"] as const;
export type SpacingStyle = (typeof SPACING_STYLES)[number];

export const RADIUS_STYLES = ["none", "small", "moderate", "rounded", "pill", "circle"] as const;
export type RadiusStyle = (typeof RADIUS_STYLES)[number];

export const TRANSITION_STYLES = ["none", "base", "smooth", "bouncy", "elastic"] as const;
export type TransitionStyle = (typeof TRANSITION_STYLES)[number];

export const SCALE_OPTIONS = ["90", "100", "110", "120"] as const;
export type ScaleStyle = (typeof SCALE_OPTIONS)[number];

export const PERSPECTIVE_STYLES = ["flat", "normal", "dramatic"] as const;
export type PerspectiveStyle = (typeof PERSPECTIVE_STYLES)[number];

export const ANIMATION_STYLES = ["none", "base", "smooth", "bouncy", "elastic"] as const;
export type AnimationStyle = (typeof ANIMATION_STYLES)[number];

export const OPACITY_STYLES = ["none", "soft", "medium", "strong"] as const;
export type OpacityStyle = (typeof OPACITY_STYLES)[number];

export const BLUR_STYLES = [
  "none",
  "soft",
  "medium",
  "strong",
  "extra",
  "huge",
  "gigantic",
] as const;
export type BlurStyle = (typeof BLUR_STYLES)[number];

export const GRADIENT_STYLES = ["none", "subtle", "vivid"] as const;
export type GradientStyle = (typeof GRADIENT_STYLES)[number];

export const FONT_STYLES = ["sans", "serif", "mono"] as const;
export type FontStyle = (typeof FONT_STYLES)[number];

export const WEIGHT_STYLES = ["light", "normal", "medium", "semibold", "bold"] as const;
export type WeightStyle = (typeof WEIGHT_STYLES)[number];

export const TRACKING_STYLES = ["tight", "wide"] as const;
export type TrackingStyle = (typeof TRACKING_STYLES)[number];

export const CONTAINER_STYLES = ["small", "medium", "large"] as const;
export type ContainerStyle = (typeof CONTAINER_STYLES)[number];

export const FONT_SIZE_STYLES = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
] as const;
export type FontSizeStyle = (typeof FONT_SIZE_STYLES)[number];

export const LINE_HEIGHT_STYLES = ["none", "tight", "snug", "normal", "relaxed", "loose"] as const;
export type LineHeightStyle = (typeof LINE_HEIGHT_STYLES)[number];

export const THEME_OPTIONS = {
  animations: ANIMATION_STYLES,
  blur: BLUR_STYLES,
  borders: BORDER_STYLES,
  brands: BRANDS,
  containers: CONTAINER_STYLES,
  fontSizes: FONT_SIZE_STYLES,
  fonts: FONT_STYLES,
  gradients: GRADIENT_STYLES,
  lineHeights: LINE_HEIGHT_STYLES,
  modes: THEME_MODES,
  opacity: OPACITY_STYLES,
  perspectives: PERSPECTIVE_STYLES,
  radius: RADIUS_STYLES,
  scales: SCALE_OPTIONS,
  shadows: SHADOW_STYLES,
  spacings: SPACING_STYLES,
  trackings: TRACKING_STYLES,
  transitions: TRANSITION_STYLES,
  weights: WEIGHT_STYLES,
} as const;

export interface ThemeConfig {
  animation: AnimationStyle;
  blur: BlurStyle;
  borders: BorderStyle;
  brand: Brand;
  container: ContainerStyle;
  font: FontStyle;
  fontSize: FontSizeStyle;
  gradient: GradientStyle;
  lineHeight: LineHeightStyle;
  opacity: OpacityStyle;
  perspective: PerspectiveStyle;
  radius: RadiusStyle;
  scale: ScaleStyle;
  shadow: ShadowStyle;
  spacing: SpacingStyle;
  theme: ThemeMode;
  tracking: TrackingStyle;
  transition: TransitionStyle;
  weight: WeightStyle;
}

export type ResolvedTheme = "light" | "dark";

export type ThemeToggleOptions = {
  labels?: { light: string; dark: string };
};

export type ThemeProviderOptions = {
  accent: "cyan" | "violet" | "emerald";
  children: React.ReactNode;
  defaultTheme: UserConfigMode;
  portfolioTheme?: string;
  /** Read only to migrate a preference written by an older version. */
  storageKey: string;
};

export interface ThemeActions {
  reset: () => void;
  setAnimation: (animation: AnimationStyle) => void;
  setBlur: (blur: BlurStyle) => void;
  setBorder: (border: BorderStyle) => void;
  setBrand: (brand: Brand) => void;
  setContainer: (container: ContainerStyle) => void;
  setFont: (font: FontStyle) => void;
  setFontSize: (fontSize: FontSizeStyle) => void;
  setGradient: (gradient: GradientStyle) => void;
  setLineHeight: (lineHeight: LineHeightStyle) => void;
  setOpacity: (opacity: OpacityStyle) => void;
  setPerspective: (perspective: PerspectiveStyle) => void;
  setRadius: (radius: RadiusStyle) => void;
  setScale: (scale: ScaleStyle) => void;
  setSettings: (settings: Partial<ThemeConfig>) => void;
  setShadow: (shadow: ShadowStyle) => void;
  setSpacing: (spacing: SpacingStyle) => void;
  setTheme: (theme: ThemeMode) => void;
  setTracking: (tracking: TrackingStyle) => void;
  setTransition: (transition: TransitionStyle) => void;
  setWeight: (weight: WeightStyle) => void;
}

export type ThemeStore = ThemeConfig & ThemeActions;

export interface UiThemeSyncOptions {
  target?: HTMLElement | null;
}
