import { cva } from "class-variance-authority";

export const textFieldVariants = cva(
  "ui-input flex w-full rounded-lg border border-border bg-background px-[var(--spacing-md)] py-[var(--spacing-sm)] text-foreground shadow-none placeholder:text-muted-foreground transition-[border-color,background-color] focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground dark:bg-foreground/5",
  {
    defaultVariants: {
      size: "default",
      state: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-[calc(var(--spacing-xl))] px-[var(--spacing-md)] text-sm",
        lg: "h-[calc(var(--spacing-2xl))] px-[var(--spacing-lg)] text-base",
        sm: "h-[calc(var(--spacing-lg))] px-[var(--spacing-sm)] text-xs",
      },
      state: {
        default: "",
        error:
          "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20",
        success:
          "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20",
        warning:
          "border-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]/20",
      },
      variant: {
        default: "border-[var(--border)]",
        destructive:
          "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20",
        info: "border-[var(--info)] focus:border-[var(--info)] focus:ring-[var(--info)]/20",
        primary: "border-[var(--primary)] focus:border-[var(--primary)]",
        success:
          "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20",
        warning:
          "border-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]/20",
      },
    },
  },
);

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    defaultVariants: {
      required: false,
    },
    variants: {
      required: {
        false: "",
        true: "after:content-['*'] after:ml-0.5 after:text-[var(--destructive)]",
      },
    },
  },
);

export const helperTextVariants = cva("text-xs leading-none", {
  defaultVariants: {
    state: "default",
  },
  variants: {
    state: {
      default: "text-[var(--muted-foreground)]",
      error: "text-[var(--destructive)]",
      success: "text-[var(--success)]",
      warning: "text-[var(--warning)]",
    },
  },
});

export const styledTextFieldStyles = {
  element1: "w-full",
  element2: "relative",
  element3:
    "pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-primary",
  getVariantClasses: "bg-card/60 backdrop-blur-md border-border/50",
  getVariantClasses2: "hover:bg-card/80 hover:backdrop-blur-lg hover:border-primary/40",
  getVariantClasses3: "focus:bg-card focus:backdrop-blur-xl focus:border-primary focus:border-2",
  getVariantClasses4: "transition-all duration-300",
  getVariantClasses5: "bg-transparent border-border/30",
  getVariantClasses6: "hover:border-primary/50",
  getVariantClasses7: "focus:border-primary",
  getVariantClasses8: "transition-colors",
  getVariantClasses9: "bg-card border-border",
  getVariantClasses10: "hover:bg-card/90 hover:border-primary/30",
  getVariantClasses11: "focus:bg-card focus:border-primary focus:border-2",
  getVariantClasses12: "transition-all",
  styledTextField: "font-medium",
  styledTextField2: "text-destructive",
  styledTextField3: "pl-10",
  styledTextField4: "border-destructive aria-invalid:border-destructive focus:border-destructive",
  styledTextField5: "ml-1",
  styledTextField6: "text-destructive",
  styledTextField7: "text-muted-foreground",
} as const;

export const textFieldStyles = {
  element1: "relative",
  element2:
    "absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]",
  element3:
    "absolute right-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]",
  element4: "text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
  element5: "text-[var(--muted-foreground)]",
  fieldLabel: "after:ml-0.5 after:text-destructive after:content-['*']",
  textArea: "w-full",
  textArea2: "min-h-[calc(var(--spacing-xl)*2)] resize-none",
  textArea3: "resize",
  textArea4: "resize-x",
  textArea5: "resize-y",
  textArea6: "resize-none",
  textField: "w-full",
  textField2: "pl-[calc(var(--spacing-md)+var(--spacing-sm)+1rem)]",
  textField3: "pr-[calc(var(--spacing-md)+var(--spacing-sm)+1rem)]",
  textField4: "w-full",
  textField5: "h-full",
} as const;
