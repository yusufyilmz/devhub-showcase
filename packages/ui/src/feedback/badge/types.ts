import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "./styles";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export type BadgeOptions = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

export type StatusBadgeOptions = {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
} & Omit<BadgeProps, "variant">;

export type CountBadgeOptions = {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
} & Omit<BadgeProps, "children">;

export type DotBadgeOptions = {
  color?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
} & Omit<BadgeProps, "children" | "size">;
