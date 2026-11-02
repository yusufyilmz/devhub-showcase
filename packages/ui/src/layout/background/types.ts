import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { backgroundVariants } from "./styles";

export interface BackgroundProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof backgroundVariants> {
  children?: React.ReactNode;
}
