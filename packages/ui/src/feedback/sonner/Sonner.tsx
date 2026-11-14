"use client";

import "./sonner.css";

import type { CSSProperties } from "react";

import { cn } from "cn";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const SonnerToaster = ({ className, style, ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      className={cn(
        "ui-toaster [&[data-sonner-toaster]]:[--border-radius:var(--radius-xl)] [&_[data-sonner-toast][data-styled='true']]:gap-s [&_[data-sonner-toast][data-styled='true']_[data-content]]:min-w-0 [&_[data-sonner-toast][data-styled='true']_[data-title]]:font-semibold [&_[data-sonner-toast][data-styled='true']_[data-description]]:leading-snug [&_[data-sonner-toast][data-styled='true']_[data-description]]:wrap-anywhere [&_[data-sonner-toast][data-styled='true']_[data-close-button]]:[inset:auto] [&_[data-sonner-toast][data-styled='true']_[data-close-button]:hover]:[color:var(--foreground)] [&_[data-sonner-toast][data-styled='true']_[data-close-button]:focus-visible]:outline-2 [&_[data-sonner-toast][data-styled='true']_[data-close-button]:focus-visible]:outline-offset-2 [&_[data-sonner-toast][data-styled='true']_[data-close-button]:focus-visible]:outline-ring [&_[data-sonner-toast][data-styled='true']:has([data-close-button])]:[padding-inline-end:2.75rem] max-[600px]:[&[data-sonner-toaster]]:[width:auto] max-[600px]:[&[data-sonner-toaster]_[data-sonner-toast][data-styled='true']]:[inset-inline-start:auto] max-[600px]:[&[data-x-position='left']_[data-sonner-toast][data-styled='true']]:[inset-inline:0_auto] max-[600px]:[&[data-x-position='center']_[data-sonner-toast][data-styled='true']]:[inset-inline:0]",
        className,
      )}
      gap={8}
      mobileOffset={12}
      offset={12}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
          "--width": "18rem",
          ...style,
        } as CSSProperties
      }
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      {...props}
    />
  );
};

export { SonnerToaster };
