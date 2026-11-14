import type { ReactNode } from "react";

import { cn } from "cn";

import { eyebrowClass } from "./eyebrow-class";

export { eyebrowClass } from "./eyebrow-class";

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
