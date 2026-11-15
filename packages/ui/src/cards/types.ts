import type * as React from "react";
import type React2 from "react";
import type { CSSProperties, ReactNode } from "react";

import type * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import type { VariantProps } from "class-variance-authority";

import type { Language } from "@shared/config";

import type { SystemProps } from "../utils/system-props";
import type {
  contentCardVariants,
  GRADIENT_MAP,
  overlayVariants,
  variantCardVariants,
} from "./styles";

export type BaseCardProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  backdrop?: "accent";
  surface?: "semantic" | "portfolio";
  interaction?: "static" | "lift";
  layout?: "stack" | "plain";
};

export type AppearanceCardAppearance = keyof typeof GRADIENT_MAP;

export type AppearanceCardAccentConfig = {
  gradient?: string;
  position?: "top" | "bottom";
  height?: number;
  borderRadius?: string | number;
};

export type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root> & {
  trigger?: React.ReactElement;
  contentProps?: React.ComponentProps<typeof HoverCardPrimitive.Content>;
};

export interface AppearanceCardProps extends Omit<BaseCardProps, "children"> {
  accent?: boolean | AppearanceCardAccentConfig;
  /**
   * Allow child elements (e.g. hover glows) to render outside the card bounds
   * @default false
   */
  allowOverflow?: boolean;
  appearance?: AppearanceCardAppearance | "none";

  children?: ReactNode;
  /**
   * Enable glow effect on hover
   * @default false
   */
  enableGlow?: boolean;
  /**
   * Enable hover effects
   * @default false
   */
  enableHover?: boolean;
  /**
   * Scale factor on hover
   * @default 1.02
   */
  hoverScale?: number;
  /**
   * Translate Y on hover (negative moves up)
   * @default -4
   */
  hoverTranslateY?: number;
  /**
   * Enable interactive elevation change
   * @default false
   */
  interactiveElevation?: boolean;
  /**
   * Transition duration in ms
   * @default 300
   */
  transitionDuration?: number;
}

export interface Author {
  avatar?: string;
  name: string;
  subtitle?: string;
}

export interface ContentCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof contentCardVariants> {
  author?: Author;
  backgroundColor?: string;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
  description?: string;
  metadata?: string;
  onCardClick?: () => void;
  overlay?: VariantProps<typeof overlayVariants>["overlay"];
  title: string;
}

export interface RevealCardProps {
  backdrop?: BaseCardProps["backdrop"];
  brief?: string | null;
  children: ReactNode;
  className?: string;
  heading: ReactNode;
  id?: string;
  labels?: RevealCardLabels;
  pinOnDetailsClick?: boolean;
  title: string;
}

export type VariantCardAccentConfig = {
  gradient?: string;
  position?: "top" | "bottom" | "left" | "right";
  size?: number;
  colors?: [string, string, string];
};

export interface VariantCardProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof VariantProps<typeof variantCardVariants> | keyof SystemProps
    >,
    VariantProps<typeof variantCardVariants>,
    Omit<SystemProps, "shadow"> {
  /**
   * Show accent border/gradient
   * @default false
   */
  accent?: boolean | VariantCardAccentConfig;

  /**
   * Allow overflow for effects like shadows/glows
   * @default false
   */
  allowOverflow?: boolean;

  children?: React.ReactNode;

  /**
   * Enable fade-in animation
   * @default false
   */
  fadeIn?: boolean;

  /**
   * Fade-in delay in ms
   * @default 0
   */
  fadeInDelay?: number;

  /**
   * Enable floating animation
   * @default false
   */
  float?: boolean;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom glow color (uses primary by default)
   */
  glowColor?: string;

  /**
   * Enable glow effect on hover
   * @default false
   */
  glowOnHover?: boolean;

  /**
   * Enable hover effects
   * @default false
   */
  hoverable?: boolean;

  /**
   * Scale factor on hover
   * @default 1.02
   */
  hoverScale?: number;

  /**
   * Translate Y on hover (negative moves up)
   * @default -4
   */
  hoverTranslateY?: number;

  /**
   * Overlay opacity (0-1)
   * @default 0.05
   */
  overlayOpacity?: number;

  /**
   * Pattern overlay
   * @default false
   */
  pattern?: "dots" | "grid" | "none";

  /**
   * Enable pulse animation
   * @default false
   */
  pulse?: boolean;

  /**
   * Transition duration in ms
   * @default 300
   */
  transitionDuration?: number;
}

export type CardType =
  | "reveal"
  | "variants"
  | "appearance"
  | "hover"
  | "tilt"
  | "animated"
  | "content"
  | undefined;

type CardShortcuts = {
  withAccent?: boolean;
  withBackdrop?: boolean;
  withBlur?: boolean;
  withHover?: boolean;
  withScale?: boolean;
  withShadow?: boolean;
  withTilt?: boolean;
} & (
  | { asChild?: boolean; withHeader?: never; withFooter?: never }
  | { asChild?: false; withHeader?: ReactNode; withFooter?: ReactNode }
);

export type StandardCardProps = BaseCardProps & CardShortcuts & { type?: "tilt" | "animated" };

export type CardProps =
  | StandardCardProps
  | (RevealCardProps & { type: "reveal"; language?: Language })
  | (RevealCardProps & { withReveal: true; type?: undefined; language?: Language })
  | (VariantCardProps & { type: "variants" })
  | (ContentCardProps & { type: "content" })
  | (AppearanceCardProps & { type: "appearance" })
  | (HoverCardProps & { type: "hover" });

export interface CardActionItem {
  label: string;
  onClick: () => void;
}

export interface CardActionsProps {
  actions: CardActionItem[];
}

export interface CardBodyProps {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export interface RevealCardcopyRevealCardProps {
  brief?: string | null;
  children: ReactNode;
  className?: string;
  heading: ReactNode;
  id?: string;
  labels?: RevealCardLabels;
  title: string;
}

export interface RevealCardLabels {
  fullDetails: string;
  hideDetails: string;
  hoverDetails: string;
  keyboardDetails: string;
  showDetails: string;
  tapClose: string;
  tapDetails: string;
}

export type AppearanceAccentOptions = {
  accentConfig: AppearanceCardAccentConfig | null;
  transitionDuration: number;
};

export type AuthorAvatarOptions = { author: Author; compact?: boolean };

export type OverlayAuthorOptions = {
  author: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
};

export type StackedAuthorOptions = {
  author: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
};

export type SplitAuthorOptions = {
  author?: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
};

export type ContentCardCopyOptions = {
  description?: string;
  size: ContentCardProps["size"];
  subtitleColor: string;
  textColor: string;
  title: string;
};

export type AppearanceCardClassesOptions = {
  allowOverflow: boolean;
  appearance: AppearanceCardAppearance | "none";
  className?: string;
  enableGlow: boolean;
  enableHover: boolean;
  interactiveElevation: boolean;
};

export type AppearanceCardStyleOptions = {
  enableHover: boolean;
  hoverScale: number;
  hoverTranslateY: number;
  transitionDuration: number;
};

export type ContentCardStyleOptions = React2.CSSProperties | undefined;

export type ContentCardStyleOptions2 = string | undefined;

export type ContentCardStyleOptions3 = string | undefined;

export type VariantCardStyleOptions = {
  allowOverflow: boolean;
  fadeIn: boolean;
  finalGlowColor: string;
  fullWidth: boolean;
  glowOnHover: boolean;
  hoverScale: number;
  hoverTranslateY: number;
  hoverable: boolean;
  isVisible: boolean;
  patternStyles: React.CSSProperties;
  style?: React.CSSProperties;
  systemStyles: React.CSSProperties;
  transitionDuration: number;
};

export type ResolveAccentOptions = boolean | AppearanceCardAccentConfig | undefined;

export type ResolveVariantAccentOptions = boolean | VariantCardAccentConfig | undefined;

export type AppearanceCardInlineStyle1Values = [
  CSSProperties["background"],
  CSSProperties["borderRadius"],
  CSSProperties["height"],
  CSSProperties["transitionDuration"],
];

export type VariantCardInlineStyle1Values = [CSSProperties["opacity"]];
export type LocalizedRevealCardProps = RevealCardProps & { language?: Language };
