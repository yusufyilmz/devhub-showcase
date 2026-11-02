import type { CSSProperties, ReactNode } from "react";

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom accent colors for the top border (gradient stops)
   */
  accentColors?: [string, string, string];
  /**
   * Allow child elements and shadows to overflow the container
   * @default false
   */
  allowOverflow?: boolean;
  /**
   * Backdrop filter blur amount (px)
   * @default 12
   */
  backdropBlur?: number;
  /**
   * Border radius size
   * @default 'lg'
   */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Children for the paper
   */
  children?: ReactNode;
  /**
   * Whether to enable fade-in animation
   * @default true
   */
  enableFade?: boolean;
  /**
   * Enable subtle floating animation
   * @default false
   */
  enableFloat?: boolean;
  /**
   * Enable glow effect on hover
   * @default false
   */
  enableGlow?: boolean;
  /**
   * Whether to enable hover effects
   * @default true
   */
  enableHover?: boolean;
  /**
   * Enable pulsing animation
   * @default false
   */
  enablePulse?: boolean;
  /**
   * Use enhanced surface background
   * @default false
   */
  enhancedSurface?: boolean;
  /**
   * Fade animation delay in milliseconds
   * @default 0
   */
  fadeDelay?: number;
  /**
   * Force card shadow
   * @default undefined
   */
  forceCardShadow?: boolean;
  /**
   * Make the paper full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Enable glass morphism effect with backdrop filter
   * @default false
   */
  glassEffect?: boolean;
  /**
   * Custom glow color
   */
  glowColor?: string;
  /**
   * Rotation on hover (degrees)
   * @default 0
   */
  hoverRotation?: number;
  /**
   * Transform scale on hover
   * @default 1.02
   */
  hoverScale?: number;
  /**
   * Transform translate Y on hover (negative = up)
   * @default -2
   */
  hoverTranslateY?: number;
  /**
   * Whether to show the top gradient border accent
   * @default true
   */
  showAccent?: boolean;
  /**
   * Spacing preset for common layouts
   * @default 'content'
   */
  spacing?: "content" | "compact" | "spacious" | "none" | "header" | "sidebar";
}

export type PaperMotionClassOptions = {
  enableFloat: boolean;
  enableGlow: boolean;
  enableHover: boolean;
  enablePulse: boolean;
  forceCardShadow?: boolean;
  glowColor?: string;
};

export type PaperStyleOptions = {
  backdropBlur: number;
  enableFade: boolean;
  enableHover: boolean;
  fadeDelay: number;
  glassEffect: boolean;
  hoverRotation: number;
  hoverScale: number;
  hoverTranslateY: number;
  style?: React.CSSProperties;
};

export type PaperInlineStyle1Values = [CSSProperties["background"]];

import type { RADIUS_CLASS, SPACING_CLASS } from "./styles";
export type PaperClassNameOptions = {
  allowOverflow: boolean;
  borderRadius: keyof typeof RADIUS_CLASS;
  className?: string;
  enableFloat: boolean;
  enableGlow: boolean;
  enableHover: boolean;
  enablePulse: boolean;
  enhancedSurface: boolean;
  forceCardShadow?: boolean;
  fullWidth: boolean;
  glassEffect: boolean;
  glowColor?: string;
  spacing: keyof typeof SPACING_CLASS;
};
