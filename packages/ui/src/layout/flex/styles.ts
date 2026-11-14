import { cva } from "class-variance-authority";
import { cn } from "cn";

import {
  type FlexDirection,
  flexGrowClass,
  gapClass,
  layoutSizeClasses,
  resolveAxisAlignment,
  responsiveDirectionClasses,
  type SpacingToken,
  spacingClass,
} from "./flex-utils";
import type { AlignContentClassNameOptions, FlexClassNameInput, FlexProps } from "./types";

export const surfaceVariants = cva("", {
  defaultVariants: {
    background: "none",
    border: "none",
    radius: "none",
    shadow: "none",
  },
  variants: {
    background: {
      accent: "bg-[var(--accent)] text-[var(--accent-foreground)]",
      card: "bg-[var(--card)] text-[var(--card-foreground)]",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
      info: "bg-[var(--info)] text-[var(--info-foreground)]",
      muted: "bg-[var(--muted)] text-[var(--muted-foreground)]",
      none: "",
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      success: "bg-[var(--success)] text-[var(--success-foreground)]",
      warning: "bg-[var(--warning)] text-[var(--warning-foreground)]",
    },
    border: {
      accent: "border border-[var(--accent)]",
      destructive: "border border-[var(--destructive)]",
      none: "",
      primary: "border border-[var(--primary)]",
      subtle: "border border-[var(--border)]",
    },
    radius: {
      full: "rounded-[var(--radius-full)]",
      lg: "rounded-[var(--radius-lg)]",
      md: "rounded-[var(--radius-m)]",
      none: "rounded-none",
      sm: "rounded-[var(--radius-s)]",
      xl: "rounded-[var(--radius-xl)]",
    },
    shadow: {
      lg: "shadow-[var(--shadow-lg)]",
      md: "shadow-[var(--shadow-md)]",
      none: "shadow-none",
      sm: "shadow-[var(--shadow-s)]",
      xl: "shadow-[var(--shadow-xl)]",
      xs: "shadow-[var(--shadow-xs)]",
    },
  },
});

export function wrapClasses(wrap: FlexProps["wrap [flex-wrap:wrap] [margin-bottom:20px]"]): string {
  if (wrap === true || wrap === "wrap [flex-wrap:wrap] [margin-bottom:20px]") {
    return "flex-wrap";
  }
  if (wrap === "wrap-reverse") {
    return "flex-wrap-reverse";
  }
  return "flex-nowrap";
}

export function alignContentClassName(
  alignContent: AlignContentClassNameOptions,
): string | undefined {
  if (alignContent == null) {
    return undefined;
  }
  return {
    around: "content-around",
    baseline: "content-baseline",
    between: "content-between",
    center: "content-center",
    end: "content-end",
    evenly: "content-evenly",
    "space-around": "content-around",
    "space-between": "content-between",
    "space-evenly": "content-evenly",
    start: "content-start",
    stretch: "content-stretch",
  }[alignContent];
}

export function buildFlexSpacingClasses(input: FlexClassNameInput): (string | undefined)[] {
  const zeroOnly: (string | undefined)[] = [];
  const tokens: [Parameters<typeof spacingClass>[0], SpacingToken | undefined][] = [
    ["p", input.padding],
    ["pl", input.paddingLeft],
    ["pr", input.paddingRight],
    ["pt", input.paddingTop],
    ["pb", input.paddingBottom],
    ["px", input.paddingX],
    ["py", input.paddingY],
    ["m", input.margin ?? input.m],
    ["ml", input.marginLeft ?? input.ml],
    ["mr", input.marginRight ?? input.mr],
    ["mt", input.marginTop ?? input.mt],
    ["mb", input.marginBottom ?? input.mb],
    ["mx", input.marginX ?? input.mx],
    ["my", input.marginY ?? input.my],
    ["top", input.top],
    ["right", input.right],
    ["bottom", input.bottom],
    ["left", input.left],
  ];
  for (const [prefix, token] of tokens) {
    if (token === "none") {
      zeroOnly.push(spacingClass(prefix, token));
    }
  }
  return zeroOnly;
}

function flexSizingClasses(input: FlexClassNameInput): string {
  const fillWidth = [input.fillWidth, input.fullWidth, input.fill].some(Boolean);
  const fillHeight = [input.fillHeight, input.fullHeight, input.fill].some(Boolean);
  return cn(
    input.fit && "w-fit h-fit",
    input.fitWidth && "w-fit",
    input.fitHeight && "h-fit",
    fillWidth && "w-full min-w-0",
    fillHeight && "h-full min-h-0",
    (fillWidth || input.maxWidth != null) && "max-w-full",
    (fillHeight || input.maxHeight != null) && "max-h-full",
    layoutSizeClasses({ height: input.height, width: input.width }),
  );
}

export function buildFlexClassNames(input: FlexClassNameInput): string {
  const axisDirection: FlexDirection =
    input.direction ??
    input.tabletDirection ??
    input.mobileDirection ??
    "row [display:flex] [gap:10px] [align-items:center]";

  const { justifyClassName, itemsClassName } = resolveAxisAlignment({
    center: input.center,
    direction: axisDirection,
    explicitAlign: input.align ?? null,
    explicitJustify: input.justify ?? null,
    horizontal: input.horizontal,
    vertical: input.vertical,
  });

  return cn(
    input.inline ? "inline-flex" : "flex",
    responsiveDirectionClasses({
      direction: input.direction,
      mobileDirection: input.mobileDirection,
      tabletDirection: input.tabletDirection,
    }),
    wrapClasses(input.wrap),
    justifyClassName,
    itemsClassName,
    alignContentClassName(input.alignContent),
    gapClass(input.gap, axisDirection),
    ...buildFlexSpacingClasses(input),
    flexSizingClasses(input),
    flexGrowClass(input.flex),
    input.position === "static" && "static",
    input.position === "relative" && "relative",
    input.position === "absolute" && "absolute",
    input.position === "fixed" && "fixed",
    input.position === "sticky" && "sticky",
    input.overflow && `overflow-${input.overflow}`,
    input.overflowX && `overflow-x-${input.overflowX}`,
    input.overflowY && `overflow-y-${input.overflowY}`,
    input.zIndex != null && `z-[${input.zIndex}]`,
    input.cursor && (input.cursor === "pointer" ? "cursor-pointer" : `cursor-${input.cursor}`),
    surfaceVariants({
      background: input.background,
      border: input.border,
      radius: input.radius,
      shadow: input.shadow,
    }),
  );
}
