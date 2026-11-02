import "./card-effects.css";

import type * as React from "react";

import { cn } from "cn";

import { AppearanceCard } from "./AppearanceCard";
import { CardBase } from "./CardBase";
import { ContentCard } from "./ContentCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";
import { RevealCard } from "./RevealCard";
import { cardStyles } from "./styles";
import type { CardProps } from "./types";
import { VariantCard } from "./VariantCard";

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
    <div className={cn(cardStyles.cardHeader, className)} data-slot="card-header" {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(cardStyles.cardTitle, className)} data-slot="card-title" {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(cardStyles.cardDescription, className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(cardStyles.cardAction, className)} data-slot="card-action" {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(cardStyles.cardContent, className)} data-slot="card-content" {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(cardStyles.cardFooter, className)} data-slot="card-footer" {...props} />
  );
}

export type { CardProps } from "./types";
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
