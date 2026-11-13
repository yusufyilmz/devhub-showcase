import { cva } from "class-variance-authority";

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-[var(--background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 w-10",
        icon: "h-10 w-10",
        lg: "h-11 w-11",
        sm: "h-9 w-9",
      },
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90",
        ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80",
      },
    },
  },
);

export const iconButtonStyles = {
  iconButton: "ui-icon-button",
} as const;

export const styledIconButtonStyles = {
  classes: "relative transition-all duration-300",
  classes2: "border",
  classes3: "fixed bottom-8 right-8 z-50 size-14 shadow-2xl",
  classes4: "hover:-translate-y-0.5",
  classes5: "hover:scale-110",
  classes6: "hover:shadow-lg",
  classes7: "animate-pulse shadow-lg",
  element1:
    "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground",
} as const;

export const colorSchemeClasses = {
  default: {
    default: "text-muted-foreground hover:bg-accent hover:text-foreground",
    filled: "bg-accent text-accent-foreground hover:bg-accent/90",
    ghost: "text-muted-foreground hover:bg-accent",
    outlined: "border-border text-foreground hover:bg-accent",
  },
  error: {
    default: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
    filled: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "text-destructive hover:bg-destructive/10",
    outlined: "border-destructive text-destructive hover:bg-destructive/10",
  },
  info: {
    default: "text-muted-foreground hover:bg-info/10 hover:text-info",
    filled: "bg-info text-info-foreground hover:bg-info/90",
    ghost: "text-info hover:bg-info/10",
    outlined: "border-info text-info hover:bg-info/10",
  },
  primary: {
    default: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
    filled: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-primary hover:bg-primary/10",
    outlined: "border-primary text-primary hover:bg-primary/10",
  },
  secondary: {
    default: "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
    filled: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "text-secondary hover:bg-secondary/10",
    outlined: "border-secondary text-secondary hover:bg-secondary/10",
  },
  success: {
    default: "text-muted-foreground hover:bg-success/10 hover:text-success",
    filled: "bg-success text-success-foreground hover:bg-success/90",
    ghost: "text-success hover:bg-success/10",
    outlined: "border-success text-success hover:bg-success/10",
  },
  warning: {
    default: "text-muted-foreground hover:bg-warning/10 hover:text-warning",
    filled: "bg-warning text-warning-foreground hover:bg-warning/90",
    ghost: "text-warning hover:bg-warning/10",
    outlined: "border-warning text-warning hover:bg-warning/10",
  },
};

export function iconButtonClassName(...values: unknown[]): string {
  return `icon-button ${values[0]}`;
}
