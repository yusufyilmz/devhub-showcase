import "./card-effects.css";

import type * as React from "react";

import { cn } from "cn";

import { AppearanceCard, type AppearanceCardProps } from "./AppearanceCard";
import { type BaseCardProps, CardBase } from "./CardBase";
import { ContentCard, type ContentCardProps } from "./ContentCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";
import { RevealCard } from "./RevealCard";
import { VariantCard, type VariantCardProps } from "./VariantCard";

export type CardProps =
  | (BaseCardProps & { type?: "" | "tilt" | "animated" })
  | (React.ComponentProps<typeof RevealCard> & { type: "reveal" })
  | (VariantCardProps & { type: "variants" })
  | (ContentCardProps & { type: "content" })
  | (AppearanceCardProps & { type: "appearance" })
  | (React.ComponentProps<typeof HoverCard> & {
      type: "hover";
      trigger?: React.ReactElement;
      contentProps?: React.ComponentProps<typeof HoverCardContent>;
    });

function Card(props: CardProps) {
  switch (props.type) {
    case "reveal": {
      const { type: _type, ...options } = props;
      return <RevealCard {...options} />;
    }
    case "variants": {
      const { type: _type, ...options } = props;
      return <VariantCard {...options} />;
    }
    case "content": {
      const { type: _type, ...options } = props;
      return <ContentCard {...options} />;
    }
    case "appearance": {
      const { type: _type, ...options } = props;
      return <AppearanceCard {...options} />;
    }
    case "hover": {
      const { type: _type, trigger, contentProps, children, ...options } = props;
      return (
        <HoverCard {...options}>
          {trigger ? (
            <>
              <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
              <HoverCardContent {...contentProps}>{children}</HoverCardContent>
            </>
          ) : (
            children
          )}
        </HoverCard>
      );
    }
    default: {
      const { type, ...options } = props;
      return <CardBase {...options} data-card-type={type || undefined} />;
    }
  }
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
