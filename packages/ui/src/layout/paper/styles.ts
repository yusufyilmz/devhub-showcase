import type { CSSProperties } from "react";

import { cn } from "cn";

import type { PaperInlineStyle1Values, PaperMotionClassOptions, PaperStyleOptions } from "./types";

export function paperSurfaceClass(glassEffect: boolean, enhancedSurface: boolean) {
  if (glassEffect) return ["bg-background/80 backdrop-blur-md", "dark:bg-background/60"];
  if (enhancedSurface) {
    return [
      "bg-gradient-to-br from-background to-background/95",
      "dark:from-background dark:to-background/90",
    ];
  }
  return "bg-background";
}

export function paperMotionClass({
  enableFloat,
  enableGlow,
  enableHover,
  enablePulse,
  forceCardShadow,
  glowColor,
}: PaperMotionClassOptions) {
  return cn(
    enableHover && "cursor-pointer hover:border-primary/30",
    enableHover &&
      forceCardShadow !== false &&
      "hover:shadow-lg [--notification-tone:var(--primary)]",
    enablePulse && "animate-pulse",
    enableFloat && "animate-float",
    enableGlow && glowColor && `hover:shadow-[0_0_20px_${glowColor}]`,
    enableGlow && !glowColor && "hover:shadow-primary/20",
  );
}

export function paperStyle(options: PaperStyleOptions) {
  return {
    ...(options.glassEffect && {
      backdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
      WebkitBackdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
    }),
    ...(options.enableFade && {
      animation: `fadeIn 600ms ease-out ${options.fadeDelay}ms both`,
    }),
    ...(options.enableHover && {
      "--hover-rotation": `${options.hoverRotation}deg`,
      "--hover-scale": options.hoverScale,
      "--hover-translate-y": `${options.hoverTranslateY}px`,
    }),
    ...options.style,
  } as React.CSSProperties;
}

export const paperStyles = {
  element1: "absolute left-0 right-0 top-0 h-1 transition-all",
  paperClassName: "relative border border-border shadow-sm transition-all duration-300",
  paperClassName2: "w-full",
  paperClassName3: "overflow-visible",
  paperClassName4:
    "overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)]",
} as const;

export function paperInlineStyle1(...values: PaperInlineStyle1Values): CSSProperties {
  return { background: values[0], zIndex: 1 };
}

import type { PaperClassNameOptions } from "./types";
export const SPACING_CLASS = {
  compact: "p-4",
  content: "p-6 m-3",
  header: "p-6",
  none: "p-0 m-0",
  sidebar: "p-3",
  spacious: "p-10 m-4",
} as const;

export const RADIUS_CLASS = {
  "2xl": "rounded-2xl",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
  sm: "rounded-sm",
  xl: "rounded-xl",
} as const;

export function accentGradientFor(accentColors?: [string, string, string]) {
  if (!accentColors) {
    return "linear-gradient(120deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--info)) 100%)";
  }
  return `linear-gradient(120deg, ${accentColors[0]} 0%, ${accentColors[1]} 50%, ${accentColors[2]} 100%)`;
}

export function paperClassName(options: PaperClassNameOptions) {
  return cn(
    paperStyles.paperClassName,
    RADIUS_CLASS[options.borderRadius],
    SPACING_CLASS[options.spacing] ?? SPACING_CLASS.content,
    options.fullWidth && paperStyles.paperClassName2,
    paperSurfaceClass(options.glassEffect, options.enhancedSurface),
    options.allowOverflow ? paperStyles.paperClassName3 : paperStyles.paperClassName4,
    paperMotionClass(options),
    options.className,
  );
}
