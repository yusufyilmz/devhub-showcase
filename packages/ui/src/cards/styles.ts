import type React from "react";
import type { CSSProperties } from "react";

import { cva } from "class-variance-authority";
import { cn } from "cn";

import type {
  AppearanceCardAppearance,
  AppearanceCardClassesOptions,
  AppearanceCardInlineStyle1Values,
  AppearanceCardStyleOptions,
  ContentCardProps,
  ContentCardStyleOptions,
  ContentCardStyleOptions2,
  ContentCardStyleOptions3,
  VariantCardInlineStyle1Values,
  VariantCardStyleOptions,
} from "./types";

export const GRADIENT_MAP = {
  default: "bg-card",
  header: "bg-gradient-to-br from-card to-card/80",
  muted: "bg-gradient-to-br from-card/95 to-card/90",
  none: "bg-card",
  subtle: "bg-gradient-to-br from-card to-card/95",
} as const;

export function appearanceCardClasses({
  allowOverflow,
  appearance,
  className,
  enableGlow,
  enableHover,
  interactiveElevation,
}: AppearanceCardClassesOptions) {
  const appearanceClass =
    GRADIENT_MAP[appearance as AppearanceCardAppearance] ?? GRADIENT_MAP.default;
  return cn(
    appearanceClass,
    "px-md",
    allowOverflow ? "overflow-visible" : "overflow-hidden",
    enableHover &&
      "cursor-pointer motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:hover:[transform:scale(var(--hover-scale))_translateY(var(--hover-translate-y))]",
    enableHover && interactiveElevation && "hover:shadow-md",
    enableHover && enableGlow && "hover:shadow-sm hover:shadow-primary/20 hover:brightness-105",
    className,
  );
}

export function appearanceCardStyle({
  enableHover,
  hoverScale,
  hoverTranslateY,
  transitionDuration,
}: AppearanceCardStyleOptions) {
  return {
    transitionDuration: `${transitionDuration}ms`,
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    ...(enableHover && {
      "--hover-scale": hoverScale,
      "--hover-translate-y": `${hoverTranslateY}px`,
    }),
  } as React.CSSProperties;
}

export const contentCardVariants = cva(
  "group/card relative flex min-w-0 max-w-full flex-col justify-between overflow-hidden",
  {
    defaultVariants: {
      layout: "overlay",
      size: "md",
      variant: "default",
    },
    variants: {
      layout: {
        overlay: "justify-between",
        split: "justify-center",
        stacked: "justify-start gap-4",
      },
      size: {
        lg: "h-96 p-6 rounded-2xl max-w-md",
        md: "h-80 p-4 rounded-xl max-w-sm",
        sm: "h-64 p-3 rounded-lg max-w-xs",
        xl: "h-[28rem] p-8 rounded-3xl max-w-lg",
      },
      variant: {
        default: "bg-cover bg-center",
        gradient: "bg-gradient-to-br",
        minimal: "bg-transparent border-border/60",
        solid: "bg-card border-border",
      },
    },
  },
);

export const overlayVariants = cva(
  "pointer-events-none absolute inset-0 motion-safe:transition-colors",
  {
    defaultVariants: {
      overlay: "medium",
    },
    variants: {
      overlay: {
        gradient: "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
        heavy: "bg-black/60 group-hover/card:bg-black/80",
        light: "bg-black/20 group-hover/card:bg-black/40",
        medium: "bg-black/40 group-hover/card:bg-black/60",
        none: "opacity-0",
      },
    },
  },
);

export function contentCardStyle(
  style: ContentCardStyleOptions,
  backgroundImage: ContentCardStyleOptions2,
  backgroundColor: ContentCardStyleOptions3,
  variant: ContentCardProps["variant"],
): React.CSSProperties {
  const cardStyle: React.CSSProperties = { ...style };
  if (backgroundImage && variant === "default") {
    cardStyle.backgroundImage = `url(${backgroundImage})`;
  }
  if (backgroundColor && variant === "solid") {
    cardStyle.backgroundColor = backgroundColor;
  }
  if (variant === "gradient") {
    cardStyle.backgroundImage =
      backgroundColor || "linear-gradient(135deg, var(--card), var(--muted))";
  }
  return cardStyle;
}

export function titleSizeClass(size: ContentCardProps["size"]) {
  if (size === "sm") return "text-lg";
  if (size === "md") return "text-xl";
  return "text-2xl";
}

export const variantCardVariants = cva(
  "relative transition-all duration-300 ease-out border border-solid",
  {
    defaultVariants: {
      rounded: "default",
      shadow: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      rounded: {
        default: "rounded-lg",
        full: "rounded-2xl",
        lg: "rounded-xl",
        none: "rounded-none",
        sm: "rounded-sm",
      },
      shadow: {
        default: "",
        lg: "shadow-lg",
        none: "",
        sm: "shadow-sm",
        xl: "shadow-xl",
      },
      size: {
        compact: "p-2 sm:p-2.5 md:p-3",
        default: "p-4 sm:p-5 md:p-6",
        lg: "p-5 sm:p-6 md:p-8",
        sm: "p-3",
        spacious: "p-6 sm:p-8 md:p-10",
      },
      variant: {
        default: "bg-card text-card-foreground border-border",
        elevated: "bg-card text-card-foreground border-border shadow-sm",
        glass:
          "bg-card/60 text-card-foreground border-border/50 backdrop-blur-xl backdrop-saturate-120",
        gradient: "bg-gradient-to-br from-card to-muted text-card-foreground border-border",
        subtle: "bg-card/90 text-card-foreground border-border/70",
      },
    },
  },
);

export function variantCardStyle(options: VariantCardStyleOptions): React.CSSProperties {
  return {
    ...options.systemStyles,
    ...options.style,
    opacity: options.isVisible ? 1 : 0,
    overflow: options.allowOverflow ? "visible" : "hidden",
    transform: options.isVisible ? "translateY(0)" : "translateY(10px)",
    transition: options.fadeIn
      ? `opacity ${options.transitionDuration}ms ease-out, transform ${options.transitionDuration}ms ease-out, all ${options.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : `all ${options.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDuration: `${options.transitionDuration}ms`,
    width: options.fullWidth ? "100%" : undefined,
    ...options.patternStyles,
    ...(options.hoverable &&
      ({
        "--hover-scale": options.hoverScale.toString(),
        "--hover-translate-y": `${options.hoverTranslateY}px`,
      } as React.CSSProperties)),
    ...(options.glowOnHover &&
      ({
        "--glow-color": options.finalGlowColor,
      } as React.CSSProperties)),
  };
}

export const cardBaseStyles = {
  cardBase:
    "ui-card relative min-w-0 rounded-xl border border-border bg-card text-card-foreground inset-shadow-[0_1px_0_color-mix(in_srgb,var(--card-foreground)_5%,transparent)] [--card-accent:var(--primary)]",
  cardBase2: "flex flex-col gap-md py-md",
  lift: "motion-safe:transition-colors motion-safe:duration-150 focus-within:border-[color-mix(in_srgb,var(--card-accent)_22%,var(--border))] [@media(pointer:fine)]:hover:border-[color-mix(in_srgb,var(--card-accent)_22%,var(--border))] motion-safe:[@media(pointer:fine)]:hover:bg-[color-mix(in_srgb,var(--card-accent)_8%,var(--card))]",
} as const;

export const appearanceCardStyles = {
  appearanceAccent: "absolute left-0 right-0 transition-all",
  appearanceAccent2: "bottom-0",
  appearanceAccent3: "top-0",
} as const;

export const contentCardStyles = {
  contentCard: "relative z-10",
  contentCard2: "space-y-4",
  contentCard3: "space-y-2",
  contentCardCopy: "relative z-10 font-bold leading-tight",
  contentCardCopy2: "relative z-10 font-normal leading-relaxed",
  contentCardCopy3: "text-xs",
  contentCardCopy4: "text-sm",
  element1: "h-8 w-8 rounded-full border border-current/20 object-cover",
  element2: "h-10 w-10 rounded-full border border-current/20 object-cover",
  element3: "relative z-10 flex items-center space-x-3",
  element4: "flex flex-col",
  element5: "ml-auto",
  element6: "flex items-center space-x-3",
  element7: "flex flex-1 flex-col",
  element8: "flex items-center justify-between pt-2",
  element9: "flex items-center space-x-2",
  element10: "space-y-2",
  element11: "group/card w-full",
  element12: "relative z-10",
  overlayAuthor: "relative z-10 font-medium text-sm",
  overlayAuthor2: "relative z-10 text-xs",
  overlayAuthor3: "text-xs",
  splitAuthor: "font-medium text-xs",
  splitAuthor2: "text-xs",
  splitAuthor3: "text-xs",
  stackedAuthor: "font-medium text-sm",
  stackedAuthor2: "text-xs",
  stackedAuthor3: "text-xs",
} as const;

export const hoverCardStyles = {
  hoverCardContent:
    "z-50 w-64 max-w-(--radix-hover-card-content-available-width) origin-(--radix-hover-card-content-transform-origin) rounded-xl border border-border bg-popover p-4 text-sm leading-relaxed wrap-anywhere text-popover-foreground shadow-lg outline-hidden motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
} as const;

export const revealCardStyles = {
  element1: "reveal-heading [&>div]:p-0 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
  element2: "reveal-preview",
  element3: "reveal-brief line-clamp-2 text-sm leading-relaxed text-muted-foreground",
  element4: "reveal-toggle mt-4 min-h-9 gap-2 px-3 text-xs text-foreground",
  element5: "reveal-hint-desktop",
  element6: "reveal-hint-touch",
  element7: "reveal-hint-keyboard",
  element8:
    "reveal-chevron text-base leading-none motion-safe:transition-transform group-aria-expanded/button:rotate-90",
  element9: "reveal-details",
  element10: "reveal-details-inner",
} as const;

export const variantCardStyles = {
  element1: "pointer-events-none absolute inset-0 z-0",
  variantCard: "pointer-events-none absolute z-10",
  variantCard2: "group-hover:h-[6px]",
  variantCard3: "relative z-10",
  variantCard4: "relative",
  variantCardContent: "pt-0",
  variantCardDescription: "text-sm text-muted-foreground",
  variantCardFooter: "flex items-center pt-4",
  variantCardHeader: "mb-4 flex flex-col space-y-1.5",
  variantCardTitle: "text-2xl font-semibold leading-none tracking-tight text-foreground",
} as const;

export const cardStyles = {
  cardAction: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
  cardContent: "px-md",
  cardDescription: "text-muted-foreground text-sm",
  cardFooter: "flex items-center px-md [.border-t]:pt-md",
  cardHeader:
    "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-xs px-md has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-md",
  cardTitle: "text-base font-semibold leading-none",
} as const;

export const cardActionsStyles = {
  element1: "px-4 py-2 border-t border-gray-200 flex justify-end space-x-2",
  element2:
    "px-4 py-1 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition duration-300",
} as const;

export const cardBodyStyles = {
  element1: "text-xl font-semibold mb-2",
} as const;

export const revealCardCopyStyles = {
  element1: "reveal-heading [&>div]:p-0 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
  element2: "reveal-preview",
  element3: "reveal-brief line-clamp-2 text-sm leading-relaxed text-muted-foreground",
  element4: "reveal-toggle mt-4 min-h-9 gap-2 px-3 text-xs text-foreground",
  element5: "reveal-hint-desktop",
  element6: "reveal-hint-touch",
  element7: "reveal-hint-keyboard",
  element8:
    "reveal-chevron text-base leading-none motion-safe:transition-transform group-aria-expanded/button:rotate-90",
  element9: "reveal-details",
  element10: "reveal-details-inner",
} as const;

export function cardBodyClassName(...values: unknown[]): string {
  return `p-0 md:p-4 ${values[0]}`;
}

export function revealCardBaseClassName(className?: string): string {
  return cn("section-card reveal-card p-md", className);
}

export function appearanceCardInlineStyle1(
  ...values: AppearanceCardInlineStyle1Values
): CSSProperties {
  return {
    background: values[0],
    borderRadius: values[1],
    height: values[2],
    transitionDuration: values[3],
  };
}

export function variantCardInlineStyle1(...values: VariantCardInlineStyle1Values): CSSProperties {
  return { background: "var(--muted)", mixBlendMode: "multiply", opacity: values[0] };
}
