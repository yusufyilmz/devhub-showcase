import { forwardRef } from "react";

import { cn } from "cn";

import { Button } from "../button";
import type { ActionButtonColor, ActionButtonProps } from "./types";

const buttonVariant = {
  contained: "default",
  ghost: "ghost",
  outlined: "secondary",
} as const;

const colorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
  info: "border-info bg-info text-info-foreground hover:bg-info/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  success: "border-success bg-success text-success-foreground hover:bg-success/90",
  warning: "border-warning bg-warning text-warning-foreground hover:bg-warning/90",
};

const outlinedColorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "border-destructive/40 text-foreground hover:bg-destructive/10",
  info: "border-info/40 text-foreground hover:bg-info/10",
  primary: "border-border text-foreground hover:bg-muted",
  success: "border-success/40 text-foreground hover:bg-success/10",
  warning: "border-warning/40 text-foreground hover:bg-warning/10",
};

const ghostColorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "text-destructive hover:bg-destructive/10",
  info: "text-info hover:bg-info/10",
  primary: "",
  success: "text-success hover:bg-success/10",
  warning: "text-warning hover:bg-warning/10",
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      colorScheme = "primary",
      variant = "contained",
      className,
      onClick,
      fullWidth,
      size = "default",
      href,
      target,
      loading,
      children,
      ...props
    },
    ref,
  ) => {
    const getColorClasses = () => {
      if (variant === "outlined") {
        return outlinedColorSchemeMap[colorScheme] ?? outlinedColorSchemeMap.primary;
      }
      if (variant === "ghost") {
        return ghostColorSchemeMap[colorScheme] ?? ghostColorSchemeMap.primary;
      }
      return colorSchemeMap[colorScheme] ?? colorSchemeMap.primary;
    };

    const baseClasses = cn(fullWidth && "w-full", getColorClasses(), className);

    const buttonProps = {
      asChild: !!href,
      className: baseClasses,
      disabled: loading || props.disabled,
      onClick,
      ref,
      size,
      variant: buttonVariant[variant],
      ...props,
    };

    if (href) {
      return (
        <Button {...buttonProps}>
          <a href={href} target={target}>
            {loading ? "Loading..." : children}
          </a>
        </Button>
      );
    }

    return <Button {...buttonProps}>{loading ? "Loading..." : children}</Button>;
  },
);

ActionButton.displayName = "ActionButton";

export default ActionButton;

export type { ActionButtonColor, ActionButtonProps } from "./types";
