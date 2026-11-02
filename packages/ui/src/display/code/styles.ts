import { cva } from "class-variance-authority";

export const codeVariants = cva(
  "relative rounded bg-[var(--muted)] px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
        sm: "text-xs px-2 py-1",
      },
      variant: {
        default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
        destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
        info: "bg-[var(--info)] text-[var(--info-foreground)]",
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
        secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        success: "bg-[var(--success)] text-[var(--success-foreground)]",
        warning: "bg-[var(--warning)] text-[var(--warning-foreground)]",
      },
    },
  },
);

export const codeStyles = {
  element1: "block p-4 overflow-x-auto",
} as const;
