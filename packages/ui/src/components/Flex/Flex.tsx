import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import {
  buildFlexStyle,
  type FlexAxisAlignment,
  type FlexDirection,
  flexGrowClass,
  gapClass,
  isLayoutSizeToken,
  type LayoutSizeToken,
  layoutSizeClasses,
  resolveAxisAlignment,
  responsiveDirectionClasses,
  type SpacingToken,
  spacingClass,
} from "./flex-utils";

const surfaceVariants = cva("", {
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

type SurfaceVariantProps = VariantProps<typeof surfaceVariants>;

function wrapClasses(wrap: FlexProps["wrap"]): string {
  if (wrap === true || wrap === "wrap") {
    return "flex-wrap";
  }
  if (wrap === "wrap-reverse") {
    return "flex-wrap-reverse";
  }
  return "flex-nowrap";
}

export interface FlexProps extends React.ComponentPropsWithoutRef<"div">, SurfaceVariantProps {
  align?: FlexAxisAlignment;
  alignContent?: FlexAxisAlignment;
  as?: React.ElementType;
  aspectRatio?: React.CSSProperties["aspectRatio"];
  bottom?: SpacingToken;
  center?: boolean;
  cursor?: React.CSSProperties["cursor"];
  direction?: FlexDirection;
  fill?: boolean;
  fillHeight?: boolean;
  fillWidth?: boolean;
  fit?: boolean;
  fitHeight?: boolean;
  fitWidth?: boolean;
  /** Flex grow/shorthand (Once UI `flex` prop) */
  flex?: string | number;
  fullHeight?: boolean;
  fullWidth?: boolean;
  gap?: SpacingToken | "-1";
  height?: number | SpacingToken | LayoutSizeToken;
  horizontal?: FlexAxisAlignment;
  inline?: boolean;
  justify?: FlexAxisAlignment;
  left?: SpacingToken;
  m?: SpacingToken;
  margin?: SpacingToken;
  marginBottom?: SpacingToken;
  marginLeft?: SpacingToken;
  marginRight?: SpacingToken;
  marginTop?: SpacingToken;
  marginX?: SpacingToken;
  marginY?: SpacingToken;
  maxHeight?: number | SpacingToken;
  maxWidth?: number | SpacingToken;
  mb?: SpacingToken;
  minHeight?: number | SpacingToken;
  minWidth?: number | SpacingToken;
  ml?: SpacingToken;
  mobileDirection?: FlexDirection;
  mr?: SpacingToken;
  mt?: SpacingToken;
  mx?: SpacingToken;
  my?: SpacingToken;
  overflow?: React.CSSProperties["overflow"];
  overflowX?: React.CSSProperties["overflowX"];
  overflowY?: React.CSSProperties["overflowY"];
  padding?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  position?: React.CSSProperties["position"];
  right?: SpacingToken;
  tabletDirection?: FlexDirection;
  /** Maps to CSS `text-align` (Once UI `align` prop) */
  textAlign?: React.CSSProperties["textAlign"];
  top?: SpacingToken;
  vertical?: FlexAxisAlignment;
  width?: number | SpacingToken | LayoutSizeToken;
  wrap?: boolean | "nowrap" | "wrap" | "wrap-reverse";
  zIndex?: number;
}

function alignContentClassName(alignContent: FlexAxisAlignment | undefined): string | undefined {
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

type FlexClassNameInput = Pick<
  FlexProps,
  | "inline"
  | "direction"
  | "tabletDirection"
  | "mobileDirection"
  | "wrap"
  | "gap"
  | "align"
  | "justify"
  | "horizontal"
  | "vertical"
  | "center"
  | "alignContent"
  | "padding"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingBottom"
  | "paddingX"
  | "paddingY"
  | "margin"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginBottom"
  | "marginX"
  | "marginY"
  | "mt"
  | "mb"
  | "ml"
  | "mr"
  | "mx"
  | "my"
  | "m"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "fit"
  | "fitWidth"
  | "fitHeight"
  | "fill"
  | "fillWidth"
  | "fillHeight"
  | "fullWidth"
  | "fullHeight"
  | "width"
  | "height"
  | "maxWidth"
  | "maxHeight"
  | "flex"
  | "position"
  | "overflow"
  | "overflowX"
  | "overflowY"
  | "zIndex"
  | "cursor"
  | "background"
  | "border"
  | "radius"
  | "shadow"
>;

function buildFlexSpacingClasses(input: FlexClassNameInput): (string | undefined)[] {
  const resolvedMarginTop = input.marginTop ?? input.mt;
  const resolvedMarginBottom = input.marginBottom ?? input.mb;
  const resolvedMarginLeft = input.marginLeft ?? input.ml;
  const resolvedMarginRight = input.marginRight ?? input.mr;
  const resolvedMarginX = input.marginX ?? input.mx;
  const resolvedMarginY = input.marginY ?? input.my;
  const resolvedMargin = input.margin ?? input.m;

  return [
    spacingClass("p", input.padding),
    spacingClass("pl", input.paddingLeft),
    spacingClass("pr", input.paddingRight),
    spacingClass("pt", input.paddingTop),
    spacingClass("pb", input.paddingBottom),
    spacingClass("px", input.paddingX),
    spacingClass("py", input.paddingY),
    spacingClass("m", resolvedMargin),
    spacingClass("ml", resolvedMarginLeft),
    spacingClass("mr", resolvedMarginRight),
    spacingClass("mt", resolvedMarginTop),
    spacingClass("mb", resolvedMarginBottom),
    spacingClass("mx", resolvedMarginX),
    spacingClass("my", resolvedMarginY),
    spacingClass("top", input.top),
    spacingClass("right", input.right),
    spacingClass("bottom", input.bottom),
    spacingClass("left", input.left),
  ];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: mirrors Once UI Flex class composition
function buildFlexClassNames(input: FlexClassNameInput): string {
  const axisDirection: FlexDirection =
    input.direction ?? input.tabletDirection ?? input.mobileDirection ?? "row";

  const { justifyClassName, itemsClassName } = resolveAxisAlignment({
    center: input.center,
    direction: axisDirection,
    explicitAlign: input.align ?? null,
    explicitJustify: input.justify ?? null,
    horizontal: input.horizontal,
    vertical: input.vertical,
  });

  const resolvedFillWidth = input.fillWidth || input.fullWidth || input.fill;
  const resolvedFillHeight = input.fillHeight || input.fullHeight || input.fill;

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
    input.fit && "w-fit h-fit",
    input.fitWidth && "w-fit",
    input.fitHeight && "h-fit",
    resolvedFillWidth && "w-full min-w-0",
    resolvedFillHeight && "h-full min-h-0",
    (resolvedFillWidth || input.maxWidth != null) && "max-w-full",
    (resolvedFillHeight || input.maxHeight != null) && "max-h-full",
    layoutSizeClasses({ height: input.height, width: input.width }),
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

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      as: Component = "div",
      className,
      style,
      inline,
      direction,
      tabletDirection,
      mobileDirection,
      horizontal,
      vertical,
      center,
      wrap = false,
      flex,
      align,
      justify,
      alignContent,
      textAlign,
      padding,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      paddingX,
      paddingY,
      margin,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      marginX,
      marginY,
      gap,
      top,
      right,
      bottom,
      left,
      mt,
      mb,
      ml,
      mr,
      mx,
      my,
      m,
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      maxHeight,
      fit,
      fitWidth,
      fitHeight,
      fill,
      fillWidth,
      fillHeight,
      fullWidth,
      fullHeight,
      aspectRatio,
      position = "relative",
      overflow,
      overflowX,
      overflowY,
      zIndex,
      cursor,
      background,
      border,
      radius,
      shadow,
      children,
      ...rest
    },
    ref,
  ) => {
    const flexStyle = buildFlexStyle({
      aspectRatio,
      flex: typeof flex === "number" && flex !== 0 && flex !== 1 ? flex : undefined,
      height: typeof height === "string" && isLayoutSizeToken(height) ? undefined : height,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      style,
      textAlign,
      width: typeof width === "string" && isLayoutSizeToken(width) ? undefined : width,
    });

    return (
      <Component
        className={cn(
          buildFlexClassNames({
            align,
            alignContent,
            background,
            border,
            bottom,
            center,
            cursor,
            direction,
            fill,
            fillHeight,
            fillWidth,
            fit,
            fitHeight,
            fitWidth,
            flex,
            fullHeight,
            fullWidth,
            gap,
            height,
            horizontal,
            inline,
            justify,
            left,
            m,
            margin,
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
            marginX,
            marginY,
            maxHeight,
            maxWidth,
            mb,
            ml,
            mobileDirection,
            mr,
            mt,
            mx,
            my,
            overflow,
            overflowX,
            overflowY,
            padding,
            paddingBottom,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingX,
            paddingY,
            position,
            radius,
            right,
            shadow,
            tabletDirection,
            top,
            vertical,
            width,
            wrap,
            zIndex,
          }),
          className,
        )}
        data-slot="flex"
        ref={ref}
        style={flexStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Flex.displayName = "Flex";

export function FlexRow({ className, ...props }: Omit<FlexProps, "direction">) {
  return <Flex className={className} direction="row" {...props} />;
}

export function FlexCol({ className, ...props }: Omit<FlexProps, "direction">) {
  return <Flex className={className} direction="column" {...props} />;
}

export function FlexCenter({ className, ...props }: Omit<FlexProps, "center">) {
  return <Flex center className={className} {...props} />;
}

export function FlexBetween({ className, ...props }: Omit<FlexProps, "horizontal">) {
  return <Flex className={className} horizontal="between" {...props} />;
}

export function FlexWrap({ className, ...props }: Omit<FlexProps, "wrap">) {
  return <Flex className={className} wrap {...props} />;
}

export function FlexSpaced({
  className,
  ...props
}: Omit<FlexProps, "horizontal" | "vertical" | "center">) {
  return <Flex className={className} gap="md" horizontal="between" vertical="center" {...props} />;
}

export function FlexStack({ className, ...props }: Omit<FlexProps, "direction" | "gap">) {
  return <Flex className={className} direction="column" gap="md" {...props} />;
}

export function FlexInline({
  className,
  ...props
}: Omit<FlexProps, "direction" | "gap" | "inline" | "vertical">) {
  return (
    <Flex className={className} direction="row" gap="sm" inline vertical="center" {...props} />
  );
}

export function FlexGrid({ className, ...props }: Omit<FlexProps, "wrap" | "gap">) {
  return <Flex className={className} gap="md" wrap {...props} />;
}
