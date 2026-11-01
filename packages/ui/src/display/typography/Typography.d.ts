import type * as React from "react";

import { type VariantProps } from "class-variance-authority";

declare const typographyVariants: (
  props?:
    | ({
        align?: "center" | "justify" | "left" | "right" | null | undefined;
        color?:
          | "accent"
          | "card"
          | "default"
          | "destructive"
          | "info"
          | "muted"
          | "popover"
          | "primary"
          | "secondary"
          | "success"
          | "warning"
          | null
          | undefined;
        decoration?: "line-through" | "none" | "overline" | "underline" | null | undefined;
        transform?: "capitalize" | "lowercase" | "none" | "uppercase" | null | undefined;
        truncate?:
          | "none"
          | "truncate"
          | "truncate-2"
          | "truncate-3"
          | "truncate-4"
          | "truncate-5"
          | null
          | undefined;
        variant?:
          | "body1"
          | "body2"
          | "caption"
          | "code"
          | "destructive"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "info"
          | "large"
          | "lead"
          | "muted"
          | "overline"
          | "small"
          | "subtitle1"
          | "subtitle2"
          | "success"
          | "warning"
          | null
          | undefined;
        weight?:
          | "black"
          | "bold"
          | "extrabold"
          | "light"
          | "medium"
          | "normal"
          | "semibold"
          | "thin"
          | null
          | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
export interface TypographyProps
  extends Omit<React.ComponentProps<"p">, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}
export declare function Typography({
  className,
  variant,
  align,
  weight,
  transform,
  decoration,
  color,
  truncate,
  as,
  ...props
}: TypographyProps): React.JSX.Element;
export declare function Heading1({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Heading2({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Heading3({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Heading4({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Heading5({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Heading6({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Body1({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Body2({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Caption({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Code({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Lead({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
export declare function Muted({
  className,
  ...props
}: Omit<TypographyProps, "variant">): React.JSX.Element;
