import type { CSSProperties } from "react";

import type { AnimatedTooltipInlineStyle1Values } from "./types";

export const animatedTooltipStyles = {
  animatedTooltip: "relative inline-block",
  animatedTooltip2:
    "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-3 py-2 font-medium text-sm",
  element1: "absolute h-0 w-0",
  element2:
    "-bottom-px absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent",
  element3:
    "-bottom-px absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm",
} as const;

export const tooltipStyles = {
  element1:
    "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
  tooltipContent:
    "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
} as const;

export function animatedTooltipInlineStyle1(
  ...values: AnimatedTooltipInlineStyle1Values
): CSSProperties {
  return { ...values[0], color: values[1] };
}
