import type { ReactNode } from "react";

import { cn } from "cn";

export function SkipLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={cn(
        "fixed top-3 z-[1000] -translate-y-[160%] rounded-lg border border-border bg-popover px-md py-sm text-sm font-medium text-popover-foreground focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [inset-inline-start:var(--spacing-sm)]",
        className,
      )}
      href={href}
    >
      {children}
    </a>
  );
}
