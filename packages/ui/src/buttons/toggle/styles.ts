import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-[background-color,border-color,color] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-[inset_0_1px_0_0_color-mix(in_oklch,white_24%,transparent)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        outline: "border-border bg-transparent hover:bg-foreground/5",
      },
    },
  },
);
