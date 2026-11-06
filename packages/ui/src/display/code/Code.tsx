import React from "react";

import { cn } from "cn";

import { codeStyles, codeVariants } from "./styles";
import type { CodeProps } from "./types";

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
  return <Code as="pre" className={codeStyles.element1} {...props} />;
}

export type { CodeProps } from "./types";
