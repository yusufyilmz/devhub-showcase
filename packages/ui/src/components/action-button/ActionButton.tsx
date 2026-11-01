import { forwardRef, type MouseEvent } from "react";

import { cn } from "cn";

import { Button } from "../button";

export type ActionButtonColor = "primary" | "warning" | "danger" | "success" | "info";

const colorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  info: "bg-info text-info-foreground hover:bg-info/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  success: "bg-success text-success-foreground hover:bg-success/90",
  warning: "bg-warning text-warning-foreground hover:bg-warning/90",
};

const outlinedColorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "border-destructive text-destructive hover:bg-destructive/10",
  info: "border-info text-info hover:bg-info/10",
  primary: "border-primary text-primary hover:bg-primary/10",
  success: "border-success text-success hover:bg-success/10",
  warning: "border-warning text-warning hover:bg-warning/10",
};

const ghostColorSchemeMap: Record<ActionButtonColor, string> = {
  danger: "text-destructive hover:bg-destructive/10",
  info: "text-info hover:bg-info/10",
  primary: "text-primary hover:bg-primary/10",
  success: "text-success hover:bg-success/10",
  warning: "text-warning hover:bg-warning/10",
};

export interface ActionButtonProps extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  colorScheme?: ActionButtonColor;
  fullWidth?: boolean;
  href?: string;
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  target?: string;
  variant?: "contained" | "outlined" | "ghost";
}

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

    const baseClasses = cn(
      "transition-all duration-200 ease-out font-semibold shadow-sm",
      "hover:-translate-y-0.5 hover:shadow-md",
      "active:translate-y-0 active:shadow-sm",
      fullWidth && "w-full",
      variant === "outlined" && "border-2 bg-transparent shadow-none",
      variant === "ghost" && "shadow-none",
      getColorClasses(),
      className,
    );

    const buttonProps = {
      asChild: !!href,
      className: baseClasses,
      disabled: loading || props.disabled,
      onClick,
      ref,
      size,
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
