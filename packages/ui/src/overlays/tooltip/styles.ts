import { cva } from "class-variance-authority";

export const tooltipContentClass = cva(
  "z-50 w-max max-w-[min(20rem,var(--radix-tooltip-content-available-width))] origin-(--radix-tooltip-content-transform-origin) rounded-md bg-(--tooltip-bg) px-s py-xs text-xs leading-relaxed wrap-anywhere shadow-md motion-safe:animate-[shared-tooltip-enter_140ms_ease-out]",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        dark: "[--tooltip-bg:var(--clr-gray-100)] text-(--clr-white)",
        default: "[--tooltip-bg:var(--foreground)] text-background shadow-none",
        gradient:
          "[--tooltip-bg:var(--primary)] bg-linear-to-br from-primary to-primary/85 text-primary-foreground",
        light:
          "[--tooltip-bg:var(--clr-white)] text-(--clr-gray-100) ring-1 ring-inset ring-border",
        minimal: "[--tooltip-bg:var(--muted)] text-foreground shadow-none",
      },
    },
  },
);
