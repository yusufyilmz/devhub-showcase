import { cn } from "cn";

import { typographyVariants } from "./styles";
import type { TypographyProps } from "./types";

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

export type { TypographyProps } from "./types";
