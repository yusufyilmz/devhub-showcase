import type { CSSProperties } from "react";

import { cn } from "cn";

import type { PaperInlineStyle1Values, PaperMotionClassOptions, PaperStyleOptions } from "./types";

export function paperSurfaceClass(glassEffect: boolean, enhancedSurface: boolean) {
  if (glassEffect) return ["bg-card/80", "dark:bg-card/65"];
  if (enhancedSurface) {
    return ["bg-linear-to-br from-card to-muted/70", "dark:from-card dark:to-muted/50"];
  }
  return "bg-card";
}

export function paperMotionClass({
  enableFloat,
  enableGlow,
  enableHover,
  enablePulse,
  forceCardShadow,
}: PaperMotionClassOptions) {
  return cn(
    enableHover &&
      "hover:border-primary/30 motion-safe:hover:[transform:scale(var(--hover-scale))_translateY(var(--hover-translate-y))_rotate(var(--hover-rotation))]",
    enableHover && forceCardShadow !== false && "hover:shadow-sm",
    enablePulse && "motion-safe:animate-pulse",
    enableFloat && "motion-safe:animate-float",
    enableGlow && "hover:shadow-[0_0_20px_var(--paper-glow)]",
  );
}

export function paperStyle(options: PaperStyleOptions) {
  return {
    ...(options.glassEffect && {
      backdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
      WebkitBackdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
    }),
    ...(options.enableFade && {
      "--paper-fade-delay": `${options.fadeDelay}ms`,
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
  element1: "pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-[inherit]",
  paperClassName:
    "relative min-w-0 border border-border/75 text-card-foreground wrap-anywhere motion-safe:transition-[border-color,box-shadow,transform]",
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
  compact: "p-sm",
  content: "m-3 p-md",
  header: "p-lg",
  none: "p-0 m-0",
  sidebar: "p-sm",
  spacious: "m-4 p-lg",
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
    return "linear-gradient(120deg, var(--primary), color-mix(in srgb, var(--primary) 55%, transparent), transparent)";
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
