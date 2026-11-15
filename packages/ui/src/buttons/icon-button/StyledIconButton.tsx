import { forwardRef } from "react";

import { cn } from "cn";

import { Button } from "../button";
import { colorSchemeClasses, styledIconButtonStyles } from "./styles";
import type { StyledIconButtonProps } from "./types";

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
    const variantKey = variant === "floating" ? "filled" : variant;
    const baseVariant =
      variantKey === "filled" ? "default" : variantKey === "outlined" ? "secondary" : "ghost";
    const colorClasses =
      colorSchemeClasses[colorScheme]?.[variantKey] ?? colorSchemeClasses.default[variantKey];

    const classes = cn(
      styledIconButtonStyles.classes,
      variant === "outlined" && styledIconButtonStyles.classes2,
      variant === "floating" && [styledIconButtonStyles.classes3, styledIconButtonStyles.classes4],
      scaled && styledIconButtonStyles.classes5,
      elevated && styledIconButtonStyles.classes6,
      animated && styledIconButtonStyles.classes7,
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
          <span className={styledIconButtonStyles.element1}>
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
          variant={baseVariant}
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
        variant={baseVariant}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  },
);

StyledIconButton.displayName = "StyledIconButton";

export default StyledIconButton;

export type { StyledIconButtonProps } from "./types";
