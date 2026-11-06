"use client";

import { Column } from "@once-ui-system/core";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type React from "react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "../../../../lib/utils";

const contentCardVariants = cva(
  "cursor-pointer overflow-hidden relative flex flex-col justify-between transition-all duration-300 ease-in-out group/card",
  {
    variants: {
      variant: {
        default: "bg-cover bg-center shadow-xl",
        gradient: "bg-gradient-to-br shadow-xl",
        solid: "bg-background border border-border shadow-lg",
        minimal: "bg-transparent border border-border/50 shadow-sm",
      },
      size: {
        sm: "h-64 p-3 rounded-lg max-w-xs",
        md: "h-80 p-4 rounded-xl max-w-sm",
        lg: "h-96 p-6 rounded-2xl max-w-md",
        xl: "h-[28rem] p-8 rounded-3xl max-w-lg",
      },
      layout: {
        overlay: "justify-between",
        stacked: "justify-start gap-4",
        split: "justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      layout: "overlay",
    },
  },
);

const overlayVariants = cva("absolute inset-0 transition-all duration-300", {
  variants: {
    overlay: {
      none: "opacity-0",
      light: "bg-black/20 group-hover/card:bg-black/40",
      medium: "bg-black/40 group-hover/card:bg-black/60",
      heavy: "bg-black/60 group-hover/card:bg-black/80",
      gradient: "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
    },
  },
  defaultVariants: {
    overlay: "medium",
  },
});

export interface Author {
  name: string;
  avatar?: string;
  subtitle?: string;
}

export interface ContentCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof contentCardVariants> {
  title: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  author?: Author;
  metadata?: string;
  children?: ReactNode;
  overlay?: VariantProps<typeof overlayVariants>["overlay"];
  onCardClick?: () => void;
  className?: string;
}

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  (
    {
      title,
      description,
      backgroundImage,
      backgroundColor,
      author,
      metadata,
      children,
      variant,
      size,
      layout,
      overlay = "medium",
      onCardClick,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const cardStyle: React.CSSProperties = {
      ...style,
      ...(backgroundImage &&
        variant === "default" && { backgroundImage: `url(${backgroundImage})` }),
      ...(backgroundColor && variant === "solid" && { backgroundColor }),
      ...(variant === "gradient" && {
        backgroundImage: backgroundColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }),
    };

    const textColor = variant === "solid" ? "text-foreground" : "text-white";
    const subtitleColor = variant === "solid" ? "text-muted-foreground" : "text-white/80";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onCardClick && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onCardClick();
      }
    };

    return (
      <div className="group/card w-full" ref={ref}>
        <Column
          className={cn(contentCardVariants({ variant, size, layout }), className)}
          style={cardStyle}
          onClick={onCardClick}
          onKeyDown={handleKeyDown}
          role={onCardClick ? "button" : undefined}
          tabIndex={onCardClick ? 0 : undefined}
          {...props}
        >
          {/* Overlay */}
          {variant !== "solid" && <div className={overlayVariants({ overlay })} />}

          {/* Author Header (for overlay layout) */}
          {author && layout === "overlay" && (
            <div className="relative z-10 flex items-center space-x-3">
              {author.avatar && (
                <Image
                  height={40}
                  width={40}
                  alt={`${author.name} avatar`}
                  src={author.avatar}
                  className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
                />
              )}
              <div className="flex flex-col">
                <p className={cn("relative z-10 font-medium text-sm", textColor)}>{author.name}</p>
                {author.subtitle && (
                  <p className={cn("relative z-10 text-xs", subtitleColor)}>{author.subtitle}</p>
                )}
              </div>
              {metadata && (
                <div className="ml-auto">
                  <p className={cn("text-xs", subtitleColor)}>{metadata}</p>
                </div>
              )}
            </div>
          )}

          {/* Content Area */}
          <div className={cn("relative z-10", layout === "stacked" ? "space-y-4" : "space-y-2")}>
            {/* Author Header (for stacked layout) */}
            {author && layout === "stacked" && (
              <div className="flex items-center space-x-3">
                {author.avatar && (
                  <Image
                    height={40}
                    width={40}
                    alt={`${author.name} avatar`}
                    src={author.avatar}
                    className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col">
                  <p className={cn("font-medium text-sm", textColor)}>{author.name}</p>
                  {author.subtitle && (
                    <p className={cn("text-xs", subtitleColor)}>{author.subtitle}</p>
                  )}
                </div>
                {metadata && <p className={cn("text-xs", subtitleColor)}>{metadata}</p>}
              </div>
            )}

            {/* Title and Description */}
            <div className="space-y-2">
              <h1
                className={cn(
                  "relative z-10 font-bold leading-tight",
                  size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
                  textColor,
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={cn(
                    "relative z-10 font-normal leading-relaxed",
                    size === "sm" ? "text-xs" : "text-sm",
                    subtitleColor,
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Custom Children */}
            {children && <div className="relative z-10">{children}</div>}

            {/* Author and Metadata (for split layout) */}
            {layout === "split" && (author || metadata) && (
              <div className="flex items-center justify-between pt-2">
                {author && (
                  <div className="flex items-center space-x-2">
                    {author.avatar && (
                      <Image
                        height={32}
                        width={32}
                        alt={`${author.name} avatar`}
                        src={author.avatar}
                        className="h-8 w-8 rounded-full border border-white/20 object-cover"
                      />
                    )}
                    <div>
                      <p className={cn("font-medium text-xs", textColor)}>{author.name}</p>
                      {author.subtitle && (
                        <p className={cn("text-xs", subtitleColor)}>{author.subtitle}</p>
                      )}
                    </div>
                  </div>
                )}
                {metadata && <p className={cn("text-xs", subtitleColor)}>{metadata}</p>}
              </div>
            )}
          </div>
        </Column>
      </div>
    );
  },
);

ContentCard.displayName = "ContentCard";
