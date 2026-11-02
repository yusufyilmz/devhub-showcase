import type { CSSProperties } from "react";

import { cn } from "cn";

import type { ChartInlineStyle1Values, IndicatorClassOptions } from "./types";

export function indicatorClass(indicator: IndicatorClassOptions, nestLabel: boolean) {
  return cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
    "h-2.5 w-2.5": indicator === "dot",
    "my-0.5": nestLabel && indicator === "dashed",
    "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
    "w-1": indicator === "line",
  });
}

export const chartStyles = {
  chartContainer:
    "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
  chartLegendContent: "flex items-center justify-center gap-4",
  chartLegendContent2: "pb-3",
  chartLegendContent3: "pt-3",
  chartLegendContent4:
    "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3",
  chartTooltipContent:
    "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
  chartTooltipValue: "flex flex-1 justify-between leading-none",
  chartTooltipValue2: "items-end",
  chartTooltipValue3: "items-center",
  element1: "grid gap-1.5",
  element2: "text-muted-foreground",
  element3: "text-foreground font-mono font-medium tabular-nums",
  element4: "grid gap-1.5",
  element5: "h-2 w-2 shrink-0 rounded-[2px]",
  rowClass:
    "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
  rowClass2: "items-center",
  tooltipLabel: "font-medium",
  tooltipLabel2: "font-medium",
} as const;

export const chartAreaInteractiveStyles = {
  element1: "@container/card",
  element2: "hidden @[540px]/card:block",
  element3: "@[540px]/card:hidden",
  element4: "hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex",
  element5:
    "flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden",
  element6: "rounded-xl",
  element7: "rounded-lg",
  element8: "rounded-lg",
  element9: "rounded-lg",
  element10: "px-2 pt-4 sm:px-6 sm:pt-6",
  element11: "aspect-auto h-[250px] w-full",
} as const;

export function chartInlineStyle1(...values: ChartInlineStyle1Values): CSSProperties {
  return { backgroundColor: values[0] };
}
