import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { codeVariants } from "./styles";

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  as?: "code" | "pre" | "span" | "div";
}
