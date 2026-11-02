import "../../cards/surfaces.css";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-[var(--background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 w-10",
        icon: "h-10 w-10",
        lg: "h-11 w-11",
        sm: "h-9 w-9",
      },
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90",
        ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        outline:
          "border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80",
      },
    },
  },
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  surface?: "semantic" | "portfolio";
}

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
        className={cn("ui-icon-button", iconButtonVariants({ className, size, variant }))}
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

type IconButtonWithLinkProps = {
  href: string;
  children: React.ReactNode;
  label: string;
  className?: string;
};

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
      className={`icon-button ${className ?? ""}`}
      surface="portfolio"
    >
      <a href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    </IconButton>
  );
};
