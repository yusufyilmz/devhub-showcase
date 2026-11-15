import type * as React from "react";

import { cn } from "cn";

import { AppearanceCard } from "../appearance-card/AppearanceCard";
import { ContentCard } from "../content-card/ContentCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card/HoverCard";
import { RevealCard } from "../reveal-card/RevealCard";
import { cardStyles } from "../styles";
import type { CardProps, StandardCardProps } from "../types";
import { VariantCard } from "../variant-card/VariantCard";
import { CardBase } from "./CardBase";

function Card(props: CardProps) {
  if ("withReveal" in props) {
    const { withReveal: _withReveal, ...options } = props;
    return <RevealCard {...options} />;
  }
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
      return <StandardCard {...props} />;
    }
  }
}

function StandardCard({
  children,
  type,
  backdrop,
  interaction,
  withAccent,
  withBackdrop,
  withBlur,
  withFooter,
  withHeader,
  withHover,
  withScale,
  withShadow,
  withTilt,
  ...props
}: StandardCardProps) {
  return (
    <CardBase
      {...props}
      backdrop={backdrop ?? (withBackdrop ? "accent" : undefined)}
      data-card-accent={withAccent || undefined}
      data-card-blur={withBlur || undefined}
      data-card-scale={withScale || undefined}
      data-card-shadow={withShadow === false ? "none" : undefined}
      data-card-type={type || (withTilt ? "tilt" : undefined)}
      interaction={interaction ?? (withHover === false ? "static" : undefined)}
    >
      {withHeader == null && withFooter == null ? (
        children
      ) : (
        <>
          {withHeader != null && <CardHeader>{withHeader}</CardHeader>}
          {children}
          {withFooter != null && <CardFooter>{withFooter}</CardFooter>}
        </>
      )}
    </CardBase>
  );
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

export type { CardProps } from "../types";
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
