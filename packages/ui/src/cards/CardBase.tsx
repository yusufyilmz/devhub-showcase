import "./surfaces.css";

import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";

export type BaseCardProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  surface?: "semantic" | "portfolio";
  interaction?: "static" | "lift";
  layout?: "stack" | "plain";
};

export function CardBase({
  className,
  asChild = false,
  surface = "semantic",
  interaction = "lift",
  layout = "stack",
  ...props
}: BaseCardProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "ui-card rounded-xl border bg-card text-card-foreground",
        layout === "stack" && "flex flex-col gap-md py-md",
        className,
      )}
      data-interaction={interaction}
      data-slot="card"
      data-surface={surface}
      {...props}
    />
  );
}
