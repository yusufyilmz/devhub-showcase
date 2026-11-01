"use client";

import Image from "next/image";
import type React from "react";
import { forwardRef, type ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Card } from "../card/Card";

const contentCardVariants = cva(
  "cursor-pointer overflow-hidden relative flex flex-col justify-between transition-all duration-300 ease-in-out group/card",
  {
    defaultVariants: {
      layout: "overlay",
      size: "md",
      variant: "default",
    },
    variants: {
      layout: {
        overlay: "justify-between",
        split: "justify-center",
        stacked: "justify-start gap-4",
      },
      size: {
        lg: "h-96 p-6 rounded-2xl max-w-md",
        md: "h-80 p-4 rounded-xl max-w-sm",
        sm: "h-64 p-3 rounded-lg max-w-xs",
        xl: "h-[28rem] p-8 rounded-3xl max-w-lg",
      },
      variant: {
        default: "bg-cover bg-center shadow-xl",
        gradient: "bg-gradient-to-br shadow-xl",
        minimal: "bg-transparent border border-border/50 shadow-sm",
        solid: "bg-background border border-border shadow-lg",
      },
    },
  },
);

const overlayVariants = cva("absolute inset-0 transition-all duration-300", {
  defaultVariants: {
    overlay: "medium",
  },
  variants: {
    overlay: {
      gradient: "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
      heavy: "bg-black/60 group-hover/card:bg-black/80",
      light: "bg-black/20 group-hover/card:bg-black/40",
      medium: "bg-black/40 group-hover/card:bg-black/60",
      none: "opacity-0",
    },
  },
});

export interface Author {
  avatar?: string;
  name: string;
  subtitle?: string;
}

export interface ContentCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof contentCardVariants> {
  author?: Author;
  backgroundColor?: string;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
  description?: string;
  metadata?: string;
  onCardClick?: () => void;
  overlay?: VariantProps<typeof overlayVariants>["overlay"];
  title: string;
}

function contentCardStyle(
  style: React.CSSProperties | undefined,
  backgroundImage: string | undefined,
  backgroundColor: string | undefined,
  variant: ContentCardProps["variant"],
): React.CSSProperties {
  const cardStyle: React.CSSProperties = { ...style };
  if (backgroundImage && variant === "default") {
    cardStyle.backgroundImage = `url(${backgroundImage})`;
  }
  if (backgroundColor && variant === "solid") {
    cardStyle.backgroundColor = backgroundColor;
  }
  if (variant === "gradient") {
    cardStyle.backgroundImage =
      backgroundColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
  return cardStyle;
}

function titleSizeClass(size: ContentCardProps["size"]) {
  if (size === "sm") return "text-lg";
  if (size === "md") return "text-xl";
  return "text-2xl";
}

function AuthorAvatar({ author, compact = false }: { author: Author; compact?: boolean }) {
  if (!author.avatar) return null;
  if (compact) {
    return (
      <Image
        alt={`${author.name} avatar`}
        className="h-8 w-8 rounded-full border border-white/20 object-cover"
        height={32}
        src={author.avatar}
        width={32}
      />
    );
  }
  return (
    <Image
      alt={`${author.name} avatar`}
      className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
      height={40}
      src={author.avatar}
      width={40}
    />
  );
}

function OverlayAuthor({
  author,
  metadata,
  subtitleColor,
  textColor,
}: {
  author: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
}) {
  return (
    <div className="relative z-10 flex items-center space-x-3">
      <AuthorAvatar author={author} />
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
  );
}

function StackedAuthor({
  author,
  metadata,
  subtitleColor,
  textColor,
}: {
  author: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <AuthorAvatar author={author} />
      <div className="flex flex-1 flex-col">
        <p className={cn("font-medium text-sm", textColor)}>{author.name}</p>
        {author.subtitle && <p className={cn("text-xs", subtitleColor)}>{author.subtitle}</p>}
      </div>
      {metadata && <p className={cn("text-xs", subtitleColor)}>{metadata}</p>}
    </div>
  );
}

function SplitAuthor({
  author,
  metadata,
  subtitleColor,
  textColor,
}: {
  author?: Author;
  metadata?: string;
  subtitleColor: string;
  textColor: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {author && (
        <div className="flex items-center space-x-2">
          <AuthorAvatar author={author} compact />
          <div>
            <p className={cn("font-medium text-xs", textColor)}>{author.name}</p>
            {author.subtitle && <p className={cn("text-xs", subtitleColor)}>{author.subtitle}</p>}
          </div>
        </div>
      )}
      {metadata && <p className={cn("text-xs", subtitleColor)}>{metadata}</p>}
    </div>
  );
}

function ContentCardCopy({
  description,
  size,
  subtitleColor,
  textColor,
  title,
}: {
  description?: string;
  size: ContentCardProps["size"];
  subtitleColor: string;
  textColor: string;
  title: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className={cn("relative z-10 font-bold leading-tight", titleSizeClass(size), textColor)}>
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
  );
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
    const cardStyle = contentCardStyle(style, backgroundImage, backgroundColor, variant);
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
        <Card
          className={cn(contentCardVariants({ layout, size, variant }), className)}
          onClick={onCardClick}
          onKeyDown={handleKeyDown}
          role={onCardClick ? "button" : undefined}
          style={cardStyle}
          tabIndex={onCardClick ? 0 : undefined}
          {...props}
        >
          {variant !== "solid" && <div className={overlayVariants({ overlay })} />}
          {author && layout === "overlay" && (
            <OverlayAuthor
              author={author}
              metadata={metadata}
              subtitleColor={subtitleColor}
              textColor={textColor}
            />
          )}
          <div className={cn("relative z-10", layout === "stacked" ? "space-y-4" : "space-y-2")}>
            {author && layout === "stacked" && (
              <StackedAuthor
                author={author}
                metadata={metadata}
                subtitleColor={subtitleColor}
                textColor={textColor}
              />
            )}
            <ContentCardCopy
              description={description}
              size={size}
              subtitleColor={subtitleColor}
              textColor={textColor}
              title={title}
            />
            {children && <div className="relative z-10">{children}</div>}
            {layout === "split" && (author || metadata) && (
              <SplitAuthor
                author={author}
                metadata={metadata}
                subtitleColor={subtitleColor}
                textColor={textColor}
              />
            )}
          </div>
        </Card>
      </div>
    );
  },
);

ContentCard.displayName = "ContentCard";
