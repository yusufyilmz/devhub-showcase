import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-xs rounded-full border px-s py-0.5 text-xs font-medium whitespace-nowrap motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border-border bg-foreground/5 text-foreground [a&]:hover:bg-foreground/10",
        destructive:
          "border-transparent bg-destructive/12 text-destructive [a&]:hover:bg-destructive/20",
        outline: "border-border bg-transparent text-foreground [a&]:hover:bg-foreground/5",
        secondary: "border-transparent bg-primary/12 text-foreground [a&]:hover:bg-primary/20",
      },
    },
  },
);

export const badgeStyles = {
  countBadge: "h-5 min-w-5 px-1 tabular-nums",
  dotBadge: "inline-block size-2 shrink-0 rounded-full",
  element1: "text-xs font-semibold",
} as const;
