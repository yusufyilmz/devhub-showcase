import type * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const typographyVariants = cva("text-[var(--foreground)]", {
  defaultVariants: {
    align: "left",
    color: "default",
    decoration: "none",
    transform: "none",
    truncate: "none",
    variant: "body1",
    weight: "normal",
  },
  variants: {
    align: {
      center: "text-center",
      justify: "text-justify",
      left: "text-left",
      right: "text-right",
    },
    color: {
      accent: "text-[var(--accent-foreground)]",
      card: "text-[var(--card-foreground)]",
      default: "text-[var(--foreground)]",
      destructive: "text-[var(--destructive)]",
      info: "text-[var(--info)]",
      muted: "text-[var(--muted-foreground)]",
      popover: "text-[var(--popover-foreground)]",
      primary: "text-[var(--primary)]",
      secondary: "text-[var(--secondary-foreground)]",
      success: "text-[var(--success)]",
      warning: "text-[var(--warning)]",
    },
    decoration: {
      "line-through": "line-through",
      none: "no-underline",
      overline: "overline",
      underline: "underline",
    },
    transform: {
      capitalize: "capitalize",
      lowercase: "lowercase",
      none: "normal-case",
      uppercase: "uppercase",
    },
    truncate: {
      none: "",
      truncate: "truncate",
      "truncate-2": "line-clamp-2",
      "truncate-3": "line-clamp-3",
      "truncate-4": "line-clamp-4",
      "truncate-5": "line-clamp-5",
    },
    variant: {
      body1: "text-base leading-relaxed",
      body2: "text-sm leading-relaxed",
      caption: "text-xs leading-normal",
      code: "font-mono text-sm bg-[var(--muted)] px-1.5 py-0.5 rounded",
      destructive: "text-[var(--destructive)]",
      h1: "text-4xl font-bold leading-tight tracking-tight",
      h2: "text-3xl font-bold leading-tight tracking-tight",
      h3: "text-2xl font-semibold leading-tight tracking-tight",
      h4: "text-xl font-semibold leading-tight tracking-tight",
      h5: "text-lg font-semibold leading-tight tracking-tight",
      h6: "text-base font-semibold leading-tight tracking-tight",
      info: "text-[var(--info)]",
      large: "text-lg leading-relaxed",
      lead: "text-lg leading-relaxed font-medium",
      muted: "text-[var(--muted-foreground)]",
      overline: "text-xs font-medium uppercase tracking-wide leading-normal",
      small: "text-sm leading-normal",
      subtitle1: "text-lg leading-relaxed",
      subtitle2: "text-base leading-relaxed",
      success: "text-[var(--success)]",
      warning: "text-[var(--warning)]",
    },
    weight: {
      black: "font-black",
      bold: "font-bold",
      extrabold: "font-extrabold",
      light: "font-light",
      medium: "font-medium",
      normal: "font-normal",
      semibold: "font-semibold",
      thin: "font-thin",
    },
  },
});

export interface TypographyProps
  extends Omit<React.ComponentProps<"p">, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export function Typography({
  className,
  variant,
  align,
  weight,
  transform,
  decoration,
  color,
  truncate,
  as,
  ...props
}: TypographyProps) {
  // Determine the appropriate HTML element based on variant
  const getElement = () => {
    if (as) return as;

    switch (variant) {
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "h5":
        return "h5";
      case "h6":
        return "h6";
      case "code":
        return "code";
      default:
        return "p";
    }
  };

  const Component = getElement();

  return (
    <Component
      className={cn(
        typographyVariants({
          align,
          className,
          color,
          decoration,
          transform,
          truncate,
          variant,
          weight,
        }),
      )}
      data-slot="typography"
      {...props}
    />
  );
}

// Convenience components for common typography patterns
export function Heading1({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h1" {...props} />;
}

export function Heading2({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h2" {...props} />;
}

export function Heading3({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h3" {...props} />;
}

export function Heading4({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h4" {...props} />;
}

export function Heading5({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h5" {...props} />;
}

export function Heading6({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="h6" {...props} />;
}

export function Body1({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="body1" {...props} />;
}

export function Body2({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="body2" {...props} />;
}

export function Caption({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="caption" {...props} />;
}

export function Code({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="code" {...props} />;
}

export function Lead({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} variant="lead" {...props} />;
}

export function Muted({ className, ...props }: Omit<TypographyProps, "variant">) {
  return <Typography className={className} color="muted" variant="body2" {...props} />;
}
