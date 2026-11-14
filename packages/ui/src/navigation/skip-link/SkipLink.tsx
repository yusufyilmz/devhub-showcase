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
        "fixed top-3 left-3 z-[1000] -translate-y-[160%] rounded-lg border border-primary bg-card px-[18px] py-3 focus:translate-y-0",
        className,
      )}
      href={href}
    >
      {children}
    </a>
  );
}
