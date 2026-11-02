import type { CSSProperties } from "react";

import type {
  ScrollableContainerInlineStyle1Values,
  ScrollableContainerInlineStyle2Values,
} from "./types";

export const scrollAreaStyles = {
  element1:
    "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
  element2: "bg-border relative flex-1 rounded-full",
  scrollArea: "relative",
  scrollBar: "flex touch-none p-px transition-colors select-none",
  scrollBar2: "h-full w-2.5 border-l border-l-transparent",
  scrollBar3: "h-2.5 flex-col border-t border-t-transparent",
} as const;

export const scrollableContainerStyles = {
  element1: "relative flex align-top scrollbar-hide overflow-hidden",
  element2: "absolute z-10 left-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2",
  element3:
    "w-full gap-8 no-scrollbar flex flex-row justify-start overflow-x-auto scrollbar-hide whitespace-nowrap p-4 max-w-full",
  element4: "absolute z-10 right-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2",
} as const;

export function scrollableContainerInlineStyle1(
  ...values: ScrollableContainerInlineStyle1Values
): CSSProperties {
  return { top: values[0] };
}

export function scrollableContainerInlineStyle2(
  ...values: ScrollableContainerInlineStyle2Values
): CSSProperties {
  return { top: values[0] };
}
