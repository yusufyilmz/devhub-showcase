import type { CSSProperties } from "react";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

export type SpacingToken =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

export type FlexAxisAlignment =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch"
  | "baseline"
  | "space-between"
  | "space-around"
  | "space-evenly";

const spacingVar = (token: SpacingToken) =>
  token === "none" ? "0" : `var(--spacing-${token === "2xl" ? "2xl" : token})`;

export function spacingClass(
  prefix:
    | "p"
    | "pt"
    | "pb"
    | "pl"
    | "pr"
    | "px"
    | "py"
    | "m"
    | "mt"
    | "mb"
    | "ml"
    | "mr"
    | "mx"
    | "my"
    | "gap"
    | "gap-x"
    | "gap-y"
    | "top"
    | "right"
    | "bottom"
    | "left",
  token: SpacingToken | undefined,
): string | undefined {
  if (!token) {
    return undefined;
  }
  if (token === "none") {
    const zero: Record<typeof prefix, string> = {
      bottom: "bottom-0",
      gap: "gap-0",
      "gap-x": "gap-x-0",
      "gap-y": "gap-y-0",
      left: "left-0",
      m: "m-0",
      mb: "mb-0",
      ml: "ml-0",
      mr: "mr-0",
      mt: "mt-0",
      mx: "mx-0",
      my: "my-0",
      p: "p-0",
      pb: "pb-0",
      pl: "pl-0",
      pr: "pr-0",
      pt: "pt-0",
      px: "px-0",
      py: "py-0",
      right: "right-0",
      top: "top-0",
    };
    return zero[prefix];
  }
  const value = spacingVar(token);
  const map: Record<typeof prefix, string> = {
    bottom: `bottom-[${value}]`,
    gap: `gap-[${value}]`,
    "gap-x": `gap-x-[${value}]`,
    "gap-y": `gap-y-[${value}]`,
    left: `left-[${value}]`,
    m: `m-[${value}]`,
    mb: `mb-[${value}]`,
    ml: `ml-[${value}]`,
    mr: `mr-[${value}]`,
    mt: `mt-[${value}]`,
    mx: `mx-[${value}]`,
    my: `my-[${value}]`,
    p: `p-[${value}]`,
    pb: `pb-[${value}]`,
    pl: `pl-[${value}]`,
    pr: `pr-[${value}]`,
    pt: `pt-[${value}]`,
    px: `px-[${value}]`,
    py: `py-[${value}]`,
    right: `right-[${value}]`,
    top: `top-[${value}]`,
  };
  return map[prefix];
}

export function normalizeAxisAlignment(
  value: FlexAxisAlignment,
): Exclude<FlexAxisAlignment, "space-between" | "space-around" | "space-evenly"> {
  switch (value) {
    case "space-between":
      return "between";
    case "space-around":
      return "around";
    case "space-evenly":
      return "evenly";
    default:
      return value;
  }
}

const justifyClass: Record<string, string> = {
  around: "justify-around",
  baseline: "justify-baseline",
  between: "justify-between",
  center: "justify-center",
  end: "justify-end",
  evenly: "justify-evenly",
  start: "justify-start",
  stretch: "justify-stretch",
};

const itemsClass: Record<string, string> = {
  around: "items-baseline",
  baseline: "items-baseline",
  between: "items-baseline",
  center: "items-center",
  end: "items-end",
  evenly: "items-baseline",
  start: "items-start",
  stretch: "items-stretch",
};

export function isRowDirection(direction: FlexDirection | undefined): boolean {
  return direction === undefined || direction === "row" || direction === "row-reverse";
}

export function resolveAxisAlignment(input: {
  direction?: FlexDirection;
  horizontal?: FlexAxisAlignment;
  vertical?: FlexAxisAlignment;
  center?: boolean;
  explicitAlign?: FlexAxisAlignment | null;
  explicitJustify?: FlexAxisAlignment | null;
}): { justifyClassName?: string; itemsClassName?: string } {
  if (input.center) {
    return { itemsClassName: "items-center", justifyClassName: "justify-center" };
  }

  if (input.explicitAlign != null || input.explicitJustify != null) {
    return resolveExplicitAlignment(input.explicitJustify, input.explicitAlign);
  }

  return resolveHorizontalVertical(input.direction, input.horizontal, input.vertical);
}

function resolveExplicitAlignment(
  explicitJustify: FlexAxisAlignment | null | undefined,
  explicitAlign: FlexAxisAlignment | null | undefined,
): { justifyClassName?: string; itemsClassName?: string } {
  const j = explicitJustify != null ? normalizeAxisAlignment(explicitJustify) : undefined;
  const a = explicitAlign != null ? normalizeAxisAlignment(explicitAlign) : undefined;
  return {
    itemsClassName: a ? itemsClass[a] : undefined,
    justifyClassName: j ? justifyClass[j] : undefined,
  };
}

function resolveHorizontalVertical(
  direction: FlexDirection | undefined,
  horizontal: FlexAxisAlignment | undefined,
  vertical: FlexAxisAlignment | undefined,
): { justifyClassName?: string; itemsClassName?: string } {
  const row = isRowDirection(direction);
  const h = horizontal ? normalizeAxisAlignment(horizontal) : undefined;
  const v = vertical ? normalizeAxisAlignment(vertical) : undefined;

  if (row) {
    return {
      itemsClassName: v ? itemsClass[v] : undefined,
      justifyClassName: h ? justifyClass[h] : undefined,
    };
  }

  return {
    itemsClassName: h ? itemsClass[h] : undefined,
    justifyClassName: v ? justifyClass[v] : undefined,
  };
}

export type LayoutSizeToken = "full" | "fit" | "screen" | "auto" | "min" | "max";

const widthLayoutClass: Record<LayoutSizeToken, string> = {
  auto: "w-auto",
  fit: "w-fit",
  full: "w-full",
  max: "w-max",
  min: "w-min",
  screen: "w-screen",
};

const heightLayoutClass: Record<LayoutSizeToken, string> = {
  auto: "h-auto",
  fit: "h-fit",
  full: "h-full",
  max: "h-max",
  min: "h-min",
  screen: "h-screen",
};

export function isLayoutSizeToken(value: unknown): value is LayoutSizeToken {
  return (
    value === "full" ||
    value === "fit" ||
    value === "screen" ||
    value === "auto" ||
    value === "min" ||
    value === "max"
  );
}

export function layoutSizeClasses(input: {
  width?: number | SpacingToken | LayoutSizeToken;
  height?: number | SpacingToken | LayoutSizeToken;
}): string[] {
  const classes: string[] = [];
  if (input.width != null && isLayoutSizeToken(input.width)) {
    classes.push(widthLayoutClass[input.width]);
  }
  if (input.height != null && isLayoutSizeToken(input.height)) {
    classes.push(heightLayoutClass[input.height]);
  }
  return classes;
}

const directionClass: Record<FlexDirection, string> = {
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
};

export function responsiveDirectionClasses(input: {
  direction?: FlexDirection;
  tabletDirection?: FlexDirection;
  mobileDirection?: FlexDirection;
}): string[] {
  const classes: string[] = [];
  const { direction, tabletDirection, mobileDirection } = input;

  if (mobileDirection) {
    classes.push(directionClass[mobileDirection]);
  }
  if (tabletDirection) {
    classes.push(`md:${directionClass[tabletDirection]}`);
  }
  if (direction) {
    if (mobileDirection || tabletDirection) {
      classes.push(`lg:${directionClass[direction]}`);
    } else {
      classes.push(directionClass[direction]);
    }
  }
  if (classes.length === 0) {
    classes.push(directionClass.row);
  }
  return classes;
}

export function gapClass(
  gap: SpacingToken | "-1" | undefined,
  direction: FlexDirection | undefined,
): string | undefined {
  if (gap === undefined) {
    return spacingClass("gap", "md");
  }
  if (gap === "-1") {
    return isRowDirection(direction) ? "gap-x-0 -space-x-px" : "gap-y-0 -space-y-px";
  }
  return spacingClass("gap", gap);
}

export function parseFlexSize(
  value: number | SpacingToken | undefined,
  axis: "width" | "height",
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "number") {
    return `${value}rem`;
  }
  if (value === "none") {
    return axis === "width" ? "auto" : "auto";
  }
  return spacingVar(value);
}

export function buildFlexStyle(input: {
  width?: number | SpacingToken;
  height?: number | SpacingToken;
  maxWidth?: number | SpacingToken;
  minWidth?: number | SpacingToken;
  minHeight?: number | SpacingToken;
  maxHeight?: number | SpacingToken;
  aspectRatio?: CSSProperties["aspectRatio"];
  textAlign?: CSSProperties["textAlign"];
  flex?: string | number;
  style?: CSSProperties;
}): CSSProperties {
  const dimension = (v: number | SpacingToken | undefined) => {
    if (v === undefined) {
      return undefined;
    }
    if (typeof v === "number") {
      return `${v}rem`;
    }
    if (v === "none") {
      return undefined;
    }
    return spacingVar(v);
  };

  return {
    aspectRatio: input.aspectRatio,
    flex: input.flex,
    height: dimension(input.height),
    maxHeight: dimension(input.maxHeight),
    maxWidth: dimension(input.maxWidth),
    minHeight: dimension(input.minHeight),
    minWidth: dimension(input.minWidth),
    textAlign: input.textAlign,
    width: dimension(input.width),
    ...input.style,
  };
}

export function flexGrowClass(flex: string | number | undefined): string | undefined {
  if (flex === undefined) {
    return undefined;
  }
  if (flex === 0 || flex === "0") {
    return "flex-none";
  }
  if (flex === 1 || flex === "1") {
    return "flex-1";
  }
  if (typeof flex === "number") {
    return undefined;
  }
  return `flex-[${flex}]`;
}
