import { cva } from "class-variance-authority";

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  defaultVariants: { size: "sm", variant: "default" },
  variants: {
    size: {
      "2xl": "size-20 text-2xl",
      lg: "size-12 text-base",
      md: "size-10 text-sm",
      sm: "size-8 text-sm",
      xl: "size-16 text-xl",
      xs: "size-6 text-xs",
    },
    variant: {
      accent: "bg-accent text-accent-foreground",
      default: "bg-muted text-muted-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      info: "bg-info text-info-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
    },
  },
});

export const avatarStyles = {
  avatarFallback: "flex size-full items-center justify-center rounded-full font-medium",
  avatarImage: "aspect-square size-full object-cover",
} as const;
