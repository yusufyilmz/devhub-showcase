"use client";

import "../../styles/components/feedback/sonner.css";

import type { CSSProperties } from "react";

import { cn } from "cn";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const SonnerToaster = ({ className, style, ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      className={cn("ui-toaster", className)}
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
