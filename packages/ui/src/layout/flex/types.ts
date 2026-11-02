import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { surfaceVariants } from "./styles";

export type SurfaceVariantProps = VariantProps<typeof surfaceVariants>;

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

export type FlexClassNameInput = Pick<
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

export type AlignContentClassNameOptions = FlexAxisAlignment | undefined;

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

export type LayoutSizeToken = "full" | "fit" | "screen" | "auto" | "min" | "max";

export type FlexSpacingInput = {
  padding?: SpacingToken;
  paddingLeft?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  margin?: SpacingToken;
  marginLeft?: SpacingToken;
  marginRight?: SpacingToken;
  marginTop?: SpacingToken;
  marginBottom?: SpacingToken;
  marginX?: SpacingToken;
  marginY?: SpacingToken;
  m?: SpacingToken;
  mt?: SpacingToken;
  mb?: SpacingToken;
  ml?: SpacingToken;
  mr?: SpacingToken;
  mx?: SpacingToken;
  my?: SpacingToken;
  top?: SpacingToken;
  right?: SpacingToken;
  bottom?: SpacingToken;
  left?: SpacingToken;
};
