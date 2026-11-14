import { cva } from "class-variance-authority";

export const tooltipContentClass = cva(
  "z-50 w-max max-w-[min(20rem,var(--radix-tooltip-content-available-width))] rounded-[var(--radius-m)] bg-(--tooltip-bg) px-3 py-1.5 text-(--tooltip-fg) text-xs leading-relaxed break-words shadow-md",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        dark: "[--tooltip-bg:var(--clr-gray-100)]",
        default: "[--tooltip-bg:var(--foreground)] shadow-none",
        gradient: "[--tooltip-bg:var(--primary)] bg-linear-to-br from-primary to-accent",
        light: "[--tooltip-bg:var(--clr-white)] ring-1 ring-inset ring-border",
        minimal: "[--tooltip-bg:var(--muted)] shadow-none",
      },
    },
  },
);
