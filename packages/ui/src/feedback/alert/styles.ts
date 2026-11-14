import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "grid w-full grid-cols-[minmax(0,1fr)] items-start gap-x-sm gap-y-xs rounded-xl border border-border bg-card px-md py-sm text-sm text-card-foreground has-[>svg]:grid-cols-[1.75rem_minmax(0,1fr)] [&>svg]:row-span-2 [&>svg]:box-content [&>svg]:size-4 [&>svg]:rounded-full [&>svg]:bg-[color:var(--alert-tone)]/12 [&>svg]:p-1.5 [&>svg]:text-[color:var(--alert-tone)] [&:has(>svg)>:is([data-slot=alert-title],[data-slot=alert-description])]:col-start-2",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "[--alert-tone:var(--primary)]",
        destructive: "border-destructive/25 bg-destructive/5 [--alert-tone:var(--destructive)]",
      },
    },
  },
);

export const alertStyles = {
  alertDescription: "min-w-0 text-sm leading-relaxed wrap-anywhere text-muted-foreground",
  alertTitle: "min-w-0 leading-snug font-semibold wrap-anywhere",
} as const;
