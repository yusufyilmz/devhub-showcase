"use client";

import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
      },
    },
  },
);

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
  );
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export function StatusBadge({
  status,
  className,
  ...props
}: {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
} & Omit<BadgeProps, "variant">) {
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
}: {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
} & Omit<BadgeProps, "children">) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge className={cn("min-w-[1.2rem] h-5", className)} variant="destructive" {...props}>
      <span className="text-xs font-semibold">{displayCount}</span>
    </Badge>
  );
}

export function DotBadge({
  color = "default",
  className,
  ...props
}: {
  color?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
} & Omit<BadgeProps, "children" | "size">) {
  const colorClasses = {
    default: "bg-[var(--primary)]",
    destructive: "bg-[var(--destructive)]",
    info: "bg-[var(--info)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
  };

  return <span className={cn("w-2 h-2 rounded-full", colorClasses[color], className)} {...props} />;
}
