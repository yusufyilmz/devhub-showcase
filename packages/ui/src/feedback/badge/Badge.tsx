"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";

import { badgeStyles, badgeVariants } from "./styles";
import type { BadgeOptions, CountBadgeOptions, DotBadgeOptions, StatusBadgeOptions } from "./types";

export function Badge({ className, variant, asChild = false, ...props }: BadgeOptions) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
  );
}

export function StatusBadge({ status, className, ...props }: StatusBadgeOptions) {
  const statusConfig = {
    away: { children: "Away", variant: "outline" as const },
    busy: { children: "Busy", variant: "destructive" as const },
    offline: { children: "Offline", variant: "secondary" as const },
    online: { children: "Online", variant: "default" as const },
  };

  const config = statusConfig[status];

  return (
    <Badge className={className} variant={config.variant} {...props}>
      {config.children}
    </Badge>
  );
}

export function CountBadge({
  count,
  max = 99,
  showZero = false,
  className,
  ...props
}: CountBadgeOptions) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge className={cn(badgeStyles.countBadge, className)} variant="destructive" {...props}>
      <span className={badgeStyles.element1}>{displayCount}</span>
    </Badge>
  );
}

export function DotBadge({ color = "default", className, ...props }: DotBadgeOptions) {
  const colorClasses = {
    default: "bg-[var(--primary)]",
    destructive: "bg-[var(--destructive)]",
    info: "bg-[var(--info)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
  };

  return <span className={cn(badgeStyles.dotBadge, colorClasses[color], className)} {...props} />;
}

export { badgeVariants } from "./styles";
export type { BadgeProps } from "./types";
