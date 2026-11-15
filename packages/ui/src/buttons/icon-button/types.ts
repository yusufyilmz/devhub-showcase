import type * as React from "react";
import type { MouseEvent, ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import type { Button } from "../button";
import type { iconButtonVariants } from "./styles";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  surface?: "semantic" | "portfolio";
}

export type IconButtonWithLinkProps = {
  href: string;
  children: React.ReactNode;
  label: string;
  className?: string;
};

export interface StyledIconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  /**
   * Enable glowing pulse animation for important actions
   * @default false
   */
  animated?: boolean;
  /**
   * Badge count for the icon button
   * @default 0
   */
  badgeCount?: number;

  children?: ReactNode;
  /**
   * Color scheme for the icon button
   * @default 'primary'
   */
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default";
  /**
   * Enable hover elevation
   * @default false
   */
  elevated?: boolean;
  /**
   * href for the icon button
   */
  href?: string;

  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Rotation angle for animations (e.g., expand/collapse)
   * @default 0
   */
  rotation?: number;
  /**
   * Enable hover scale effect
   * @default true
   */
  scaled?: boolean;
  /**
   * target for the icon button
   */
  target?: string;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: "default" | "filled" | "outlined" | "ghost" | "floating";
}
