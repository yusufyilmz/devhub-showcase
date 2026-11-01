import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";

type CardProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  surface?: "semantic" | "portfolio";
  interaction?: "static" | "lift";
  layout?: "stack" | "plain";
};

function Card({
  className,
  asChild = false,
  surface = "semantic",
  interaction = "lift",
  layout = "stack",
  ...props
}: CardProps) {
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

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-xs px-md has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-md",
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-base font-semibold leading-none", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-md", className)} data-slot="card-content" {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-md [.border-t]:pt-md", className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
