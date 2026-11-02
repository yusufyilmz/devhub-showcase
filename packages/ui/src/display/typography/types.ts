import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { typographyVariants } from "./styles";

export interface TypographyProps
  extends Omit<React.ComponentProps<"p">, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}
