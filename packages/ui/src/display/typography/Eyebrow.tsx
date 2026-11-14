import type { ReactNode } from "react";

import { cn } from "cn";

export const eyebrowClass =
  "eyebrow font-mono text-[11px] leading-[1.6] font-medium tracking-[0.15em] text-primary uppercase";

export function Eyebrow({
  as: Tag = "p",
  className,
  children,
}: {
  as?: "p" | "span";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn(eyebrowClass, className)}>{children}</Tag>;
}
