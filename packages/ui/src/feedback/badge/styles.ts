import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg]:size-3",
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
  countBadge: "min-w-[1.2rem] h-5",
  dotBadge: "w-2 h-2 rounded-full",
  element1: "text-xs font-semibold",
} as const;
