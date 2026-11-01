import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const codeVariants = cva(
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

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  as?: "code" | "pre" | "span" | "div";
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, size, as: Component = "code", ...props }, ref) => {
    return React.createElement(Component, {
      className: cn(codeVariants({ className, size, variant })),
      ref,
      ...props,
    });
  },
);
Code.displayName = "Code";

// Convenience components
export function CodePrimary(props: Omit<CodeProps, "variant">) {
  return <Code variant="default" {...props} />;
}

export function CodeSecondary(props: Omit<CodeProps, "variant">) {
  return <Code variant="secondary" {...props} />;
}

export function CodeDestructive(props: Omit<CodeProps, "variant">) {
  return <Code variant="destructive" {...props} />;
}

export function CodeSuccess(props: Omit<CodeProps, "variant">) {
  return <Code variant="success" {...props} />;
}

export function CodeWarning(props: Omit<CodeProps, "variant">) {
  return <Code variant="warning" {...props} />;
}

export function CodeInfo(props: Omit<CodeProps, "variant">) {
  return <Code variant="info" {...props} />;
}

export function CodeSmall(props: Omit<CodeProps, "size">) {
  return <Code size="sm" {...props} />;
}

export function CodeLarge(props: Omit<CodeProps, "size">) {
  return <Code size="lg" {...props} />;
}

// Pre component for code blocks
export function CodeBlock(props: Omit<CodeProps, "as">) {
  return <Code as="pre" className="block p-4 overflow-x-auto" {...props} />;
}
