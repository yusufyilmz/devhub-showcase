import { cva } from "class-variance-authority";

export const tooltipContentClass = cva(
  "z-50 w-max max-w-[min(20rem,var(--radix-tooltip-content-available-width))] rounded-[var(--radius-m)] bg-(--tooltip-bg) px-3 py-1.5 text-(--tooltip-fg) text-xs leading-relaxed break-words shadow-md",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        dark: "[--tooltip-bg:var(--clr-gray-100)] [--tooltip-fg:var(--clr-white)]",
        default: "[--tooltip-bg:var(--foreground)] [--tooltip-fg:var(--background)] shadow-none",
        gradient:
          "[--tooltip-bg:var(--primary)] [--tooltip-fg:var(--primary-foreground)] bg-linear-to-br from-primary to-accent",
        light:
          "[--tooltip-bg:var(--clr-white)] [--tooltip-fg:var(--clr-gray-100)] ring-1 ring-inset ring-border",
        minimal: "[--tooltip-bg:var(--muted)] [--tooltip-fg:var(--foreground)] shadow-none",
      },
    },
  },
);
