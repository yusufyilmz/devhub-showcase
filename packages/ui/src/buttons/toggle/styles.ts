import { cva } from "class-variance-authority";

export const pressedToggleStyles =
  "[&:is([aria-pressed=true],[data-state=on])]:border-border [&:is([aria-pressed=true],[data-state=on])]:bg-accent [&:is([aria-pressed=true],[data-state=on])]:text-accent-foreground";

export const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap text-muted-foreground outline-none motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    pressedToggleStyles,
  ],
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-2 min-w-9",
        lg: "h-10 px-2.5 min-w-10",
        sm: "h-8 px-1.5 min-w-8",
      },
      variant: {
        default: "bg-transparent",
        outline: "border-border bg-transparent",
      },
    },
  },
);
