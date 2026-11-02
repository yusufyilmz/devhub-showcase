import type * as React from "react";
import type { CSSProperties } from "react";

import type * as RechartsPrimitive from "recharts";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"dark" | "light", string> }
  );
};

export type ChartContextProps = {
  config: ChartConfig;
};

export type RechartsTooltipItem = NonNullable<
  React.ComponentProps<typeof RechartsPrimitive.Tooltip>["payload"]
>[number];

export type ChartOptions = { id: string; config: ChartConfig };

export type ChartTooltipSwatchOptions = {
  hideIndicator?: boolean;
  indicator: "line" | "dot" | "dashed";
  indicatorColor?: string;
  nestLabel: boolean;
};

export type ChartTooltipValueOptions = {
  item: RechartsTooltipItem;
  itemConfig?: { icon?: React.ComponentType; label?: React.ReactNode } | null;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
};

export type ChartTooltipRowOptions = {
  color?: string;
  config: ChartConfig;
  formatter?: React.ComponentProps<typeof RechartsPrimitive.Tooltip>["formatter"];
  hideIndicator?: boolean;
  index: number;
  indicator: "line" | "dot" | "dashed";
  item: RechartsTooltipItem;
  nameKey?: string;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
};

export type IndicatorClassOptions = "line" | "dot" | "dashed";

export type ChartContainerOptions = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
};

export type TooltipItemKeyOptions = string | undefined;

export type TooltipItemColorOptions = string | undefined;

export type ChartTooltipContentOptions = React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  };

export type ChartLegendContentOptions = React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  };

export type ChartInlineStyle1Values = [CSSProperties["backgroundColor"]];
