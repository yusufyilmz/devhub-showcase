import { forwardRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "cn";

import { Button } from "../button";

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

const colorSchemeClasses = {
  default: {
    default: "text-muted-foreground hover:bg-accent hover:text-foreground",
    filled: "bg-accent text-accent-foreground hover:bg-accent/90",
    ghost: "text-muted-foreground hover:bg-accent",
    outlined: "border-border text-foreground hover:bg-accent",
  },
  error: {
    default: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
    filled: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "text-destructive hover:bg-destructive/10",
    outlined: "border-destructive text-destructive hover:bg-destructive/10",
  },
  info: {
    default: "text-muted-foreground hover:bg-info/10 hover:text-info",
    filled: "bg-info text-info-foreground hover:bg-info/90",
    ghost: "text-info hover:bg-info/10",
    outlined: "border-info text-info hover:bg-info/10",
  },
  primary: {
    default: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
    filled: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-primary hover:bg-primary/10",
    outlined: "border-primary text-primary hover:bg-primary/10",
  },
  secondary: {
    default: "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
    filled: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "text-secondary hover:bg-secondary/10",
    outlined: "border-secondary text-secondary hover:bg-secondary/10",
  },
  success: {
    default: "text-muted-foreground hover:bg-success/10 hover:text-success",
    filled: "bg-success text-success-foreground hover:bg-success/90",
    ghost: "text-success hover:bg-success/10",
    outlined: "border-success text-success hover:bg-success/10",
  },
  warning: {
    default: "text-muted-foreground hover:bg-warning/10 hover:text-warning",
    filled: "bg-warning text-warning-foreground hover:bg-warning/90",
    ghost: "text-warning hover:bg-warning/10",
    outlined: "border-warning text-warning hover:bg-warning/10",
  },
};

export const StyledIconButton = forwardRef<HTMLButtonElement, StyledIconButtonProps>(
  (
    {
      badgeCount = 0,
      colorScheme = "primary",
      variant = "default",
      scaled = true,
      elevated = false,
      rotation = 0,
      animated = false,
      href,
      target,
      size = "icon",
      className,
      children,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Get color classes based on variant (floating uses filled styles)
    const effectiveVariant = variant === "floating" ? "filled" : variant;
    const variantKey = effectiveVariant === "default" ? "default" : effectiveVariant;
    const colorClasses =
      colorSchemeClasses[colorScheme]?.[variantKey] ?? colorSchemeClasses.default[variantKey];

    const classes = cn(
      "relative transition-all duration-300",
      variant === "outlined" && "border-2",
      variant === "floating" && [
        "fixed bottom-8 right-8 z-50 size-14 shadow-2xl",
        "hover:-translate-y-0.5",
      ],
      scaled && "hover:scale-110",
      elevated && "hover:shadow-lg",
      animated && "animate-pulse shadow-lg",
      colorClasses,
      className,
    );

    const style = {
      transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
    } as React.CSSProperties;

    const buttonContent = (
      <>
        {children}
        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <Button
          asChild
          className={classes}
          disabled={disabled}
          ref={ref}
          size={size}
          style={style}
          {...props}
        >
          <a href={href} target={target}>
            {buttonContent}
          </a>
        </Button>
      );
    }

    return (
      <Button
        className={classes}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        size={size}
        style={style}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  },
);

StyledIconButton.displayName = "StyledIconButton";

export default StyledIconButton;
