"use client";

import React from "react";

import { cn } from "cn";
import * as RechartsPrimitive from "recharts";

import { chartInlineStyle1, chartStyles, indicatorClass } from "./styles";
import type {
  ChartConfig,
  ChartContainerOptions,
  ChartContextProps,
  ChartLegendContentOptions,
  ChartOptions,
  ChartTooltipContentOptions,
  ChartTooltipRowOptions,
  ChartTooltipSwatchOptions,
  ChartTooltipValueOptions,
  RechartsTooltipItem,
  TooltipItemColorOptions,
  TooltipItemKeyOptions,
} from "./types";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { dark: ".dark", light: "" } as const;

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({ id, className, children, config, ...props }: ChartContainerOptions) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(chartStyles.chartContainer, className)}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: ChartOptions) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style>
      {Object.entries(THEMES)
        .map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
        )
        .join("\n")}
    </style>
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function tooltipItemKey(nameKey: TooltipItemKeyOptions, item: RechartsTooltipItem) {
  if (nameKey) return `${nameKey}`;
  if (item.name) return `${item.name}`;
  if (item.dataKey) return `${item.dataKey}`;
  return "value";
}

function tooltipItemColor(color: TooltipItemColorOptions, item: RechartsTooltipItem) {
  if (color) return color;
  if (item.payload?.fill) return item.payload.fill;
  return item.color;
}

function ChartTooltipSwatch({
  hideIndicator,
  indicator,
  indicatorColor,
  nestLabel,
}: ChartTooltipSwatchOptions) {
  if (hideIndicator) return null;
  return (
    <div
      className={indicatorClass(indicator, nestLabel)}
      style={
        {
          "--color-bg": indicatorColor,
          "--color-border": indicatorColor,
        } as React.CSSProperties
      }
    />
  );
}

function ChartTooltipValue({
  item,
  itemConfig,
  nestLabel,
  tooltipLabel,
}: ChartTooltipValueOptions) {
  return (
    <div
      className={cn(
        chartStyles.chartTooltipValue,
        nestLabel ? chartStyles.chartTooltipValue2 : chartStyles.chartTooltipValue3,
      )}
    >
      <div className={chartStyles.element1}>
        {nestLabel ? tooltipLabel : null}
        <span className={chartStyles.element2}>{itemConfig?.label || item.name}</span>
      </div>
      {item.value ? (
        <span className={chartStyles.element3}>{item.value.toLocaleString()}</span>
      ) : null}
    </div>
  );
}

function ChartTooltipRow({
  color,
  config,
  formatter,
  hideIndicator,
  index,
  indicator,
  item,
  nameKey,
  nestLabel,
  tooltipLabel,
}: ChartTooltipRowOptions) {
  const key = tooltipItemKey(nameKey, item);
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = tooltipItemColor(color, item);
  const rowClass = cn(chartStyles.rowClass, indicator === "dot" && chartStyles.rowClass2);

  if (formatter && item?.value !== undefined && item.name) {
    return (
      <div className={rowClass}>{formatter(item.value, item.name, item, index, item.payload)}</div>
    );
  }

  return (
    <div className={rowClass}>
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        <ChartTooltipSwatch
          hideIndicator={hideIndicator}
          indicator={indicator}
          indicatorColor={indicatorColor}
          nestLabel={nestLabel}
        />
      )}
      <ChartTooltipValue
        item={item}
        itemConfig={itemConfig}
        nestLabel={nestLabel}
        tooltipLabel={tooltipLabel}
      />
    </div>
  );
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentOptions) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn(chartStyles.tooltipLabel, labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn(chartStyles.tooltipLabel2, labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div className={cn(chartStyles.chartTooltipContent, className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className={chartStyles.element4}>
        {payload.map((item, index) => (
          <ChartTooltipRow
            color={color}
            config={config}
            formatter={formatter}
            hideIndicator={hideIndicator}
            index={index}
            indicator={indicator}
            item={item}
            key={item.dataKey}
            nameKey={nameKey}
            nestLabel={nestLabel}
            tooltipLabel={tooltipLabel}
          />
        ))}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentOptions) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        chartStyles.chartLegendContent,
        verticalAlign === "top" ? chartStyles.chartLegendContent2 : chartStyles.chartLegendContent3,
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div className={cn(chartStyles.chartLegendContent4)} key={item.value}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div className={chartStyles.element5} style={chartInlineStyle1(item.color)} />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export type { ChartConfig } from "./types";
export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
