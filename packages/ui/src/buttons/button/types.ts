import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "./styles";

export type ButtonIconOptions = {
  icon: ReactNode;
  position: "inline-start" | "inline-end";
};

export type ButtonOptions = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    href?: string;
    target?: string;
    rel?: string;
  };
