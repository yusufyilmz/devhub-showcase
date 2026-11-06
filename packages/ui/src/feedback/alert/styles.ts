import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "grid w-full grid-cols-[minmax(0,1fr)] items-start gap-x-[0.75rem] gap-y-[0.1875rem] rounded-lg border border-l-[3px] border-l-(--alert-tone) bg-card px-[1rem] py-[0.75rem] text-sm text-card-foreground has-[>svg]:grid-cols-[1.75rem_minmax(0,1fr)] [&>svg]:row-span-2 [&>svg]:box-content [&>svg]:size-[1rem] [&>svg]:rounded-full [&>svg]:bg-[color-mix(in_srgb,var(--alert-tone)_12%,transparent)] [&>svg]:p-[0.375rem] [&>svg]:text-(--alert-tone) [&:has(>svg)>:is([data-slot=alert-title],[data-slot=alert-description])]:col-start-2",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "[--alert-tone:var(--primary)]",
        destructive: "[--alert-tone:var(--destructive)]",
      },
    },
  },
);

export const alertStyles = {
  alertDescription: "min-w-0 text-sm leading-relaxed text-muted-foreground",
  alertTitle: "min-w-0 font-semibold leading-snug",
} as const;
