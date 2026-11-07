import React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";

import { iconButtonClassName, iconButtonStyles, iconButtonVariants } from "./styles";
import type { IconButtonProps, IconButtonWithLinkProps } from "./types";

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "default",
      size,
      asChild = false,
      surface = "semantic",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          iconButtonStyles.iconButton,
          iconButtonVariants({ className, size, variant }),
        )}
        data-slot="icon-button"
        data-surface={surface}
        data-variant={variant}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export const IconButtonWithLink = ({
  href,
  children,
  label,
  className,
}: IconButtonWithLinkProps) => {
  return (
    <IconButton
      aria-label={label}
      asChild
      className={iconButtonClassName(className ?? "")}
      surface="portfolio"
    >
      <a href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    </IconButton>
  );
};

export type { IconButtonProps } from "./types";
