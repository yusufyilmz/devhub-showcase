import React from "react";

import { cn } from "cn";

import { buildFlexStyle, isLayoutSizeToken } from "./flex-utils";
import { buildFlexClassNames } from "./styles";
import type { FlexProps } from "./types";

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
      bottom,
      flex: typeof flex === "number" && flex !== 0 && flex !== 1 ? flex : undefined,
      gap,
      height: typeof height === "string" && isLayoutSizeToken(height) ? undefined : height,
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
      minHeight,
      minWidth,
      ml,
      mr,
      mt,
      mx,
      my,
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingX,
      paddingY,
      right,
      style,
      textAlign,
      top,
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

export type { FlexProps } from "./types";
