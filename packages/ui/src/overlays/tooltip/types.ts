import type { ComponentProps, ReactNode } from "react";

import type * as TooltipPrimitive from "@radix-ui/react-tooltip";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "default" | "dark" | "light" | "gradient" | "minimal";

export type TooltipRootProps = ComponentProps<typeof TooltipPrimitive.Root>;

export interface TooltipProps {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
  disabled?: boolean;
  placement?: TooltipPlacement;
  title: ReactNode;
  variant?: TooltipVariant;
}

export interface TooltipContentProps extends ComponentProps<typeof TooltipPrimitive.Content> {
  arrow?: boolean;
  variant?: TooltipVariant;
}
