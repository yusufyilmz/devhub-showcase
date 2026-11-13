"use client";

import Image from "next/image";
import type React from "react";
import { forwardRef } from "react";

import { cn } from "cn";

import { Avatar, AvatarFallback } from "../../display/avatar";
import { CardBase as Card } from "../card/CardBase";
import {
  contentCardStyle,
  contentCardStyles,
  contentCardVariants,
  overlayVariants,
  titleSizeClass,
} from "../styles";
import type {
  AuthorAvatarOptions,
  ContentCardCopyOptions,
  ContentCardProps,
  OverlayAuthorOptions,
  SplitAuthorOptions,
  StackedAuthorOptions,
} from "../types";

function AuthorAvatar({ author, compact = false }: AuthorAvatarOptions) {
  if (!author.avatar) {
    const initials = author.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return (
      <Avatar aria-hidden="true" size={compact ? "sm" : "md"}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  }
  if (compact) {
    return (
      <Image
        alt={`${author.name} avatar`}
        className={contentCardStyles.element1}
        height={32}
        src={author.avatar}
        width={32}
      />
    );
  }
  return (
    <Image
      alt={`${author.name} avatar`}
      className={contentCardStyles.element2}
      height={40}
      src={author.avatar}
      width={40}
    />
  );
}

function OverlayAuthor({ author, metadata, subtitleColor, textColor }: OverlayAuthorOptions) {
  return (
    <div className={contentCardStyles.element3}>
      <AuthorAvatar author={author} />
      <div className={contentCardStyles.element4}>
        <p className={cn(contentCardStyles.overlayAuthor, textColor)}>{author.name}</p>
        {author.subtitle && (
          <p className={cn(contentCardStyles.overlayAuthor2, subtitleColor)}>{author.subtitle}</p>
        )}
      </div>
      {metadata && (
        <div className={contentCardStyles.element5}>
          <p className={cn(contentCardStyles.overlayAuthor3, subtitleColor)}>{metadata}</p>
        </div>
      )}
    </div>
  );
}

function StackedAuthor({ author, metadata, subtitleColor, textColor }: StackedAuthorOptions) {
  return (
    <div className={contentCardStyles.element6}>
      <AuthorAvatar author={author} />
      <div className={contentCardStyles.element7}>
        <p className={cn(contentCardStyles.stackedAuthor, textColor)}>{author.name}</p>
        {author.subtitle && (
          <p className={cn(contentCardStyles.stackedAuthor2, subtitleColor)}>{author.subtitle}</p>
        )}
      </div>
      {metadata && (
        <p className={cn(contentCardStyles.stackedAuthor3, subtitleColor)}>{metadata}</p>
      )}
    </div>
  );
}

function SplitAuthor({ author, metadata, subtitleColor, textColor }: SplitAuthorOptions) {
  return (
    <div className={contentCardStyles.element8}>
      {author && (
        <div className={contentCardStyles.element9}>
          <AuthorAvatar author={author} compact />
          <div>
            <p className={cn(contentCardStyles.splitAuthor, textColor)}>{author.name}</p>
            {author.subtitle && (
              <p className={cn(contentCardStyles.splitAuthor2, subtitleColor)}>{author.subtitle}</p>
            )}
          </div>
        </div>
      )}
      {metadata && <p className={cn(contentCardStyles.splitAuthor3, subtitleColor)}>{metadata}</p>}
    </div>
  );
}

function ContentCardCopy({
  description,
  size,
  subtitleColor,
  textColor,
  title,
}: ContentCardCopyOptions) {
  return (
    <div className={contentCardStyles.element10}>
      <h1 className={cn(contentCardStyles.contentCardCopy, titleSizeClass(size), textColor)}>
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            contentCardStyles.contentCardCopy2,
            size === "sm" ? contentCardStyles.contentCardCopy3 : contentCardStyles.contentCardCopy4,
            subtitleColor,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function hasMediaBackground({
  backgroundColor,
  backgroundImage,
  style,
  variant,
}: Pick<ContentCardProps, "backgroundColor" | "backgroundImage" | "style" | "variant">) {
  if (variant === "gradient") return Boolean(backgroundColor);
  return variant === "default" && Boolean(backgroundImage || style?.backgroundImage);
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
      variant = "default",
      size = "md",
      layout = "overlay",
      overlay = "medium",
      onCardClick,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const cardStyle = contentCardStyle(style, backgroundImage, backgroundColor, variant);
    const hasMedia = hasMediaBackground({ backgroundColor, backgroundImage, style, variant });
    const textColor = hasMedia ? "text-white" : "text-foreground";
    const subtitleColor = hasMedia ? "text-white/80" : "text-muted-foreground";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onCardClick && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onCardClick();
      }
    };

    return (
      <div className={contentCardStyles.element11} ref={ref}>
        <Card
          className={cn(
            contentCardVariants({ layout, size, variant }),
            onCardClick &&
              "cursor-pointer focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
            className,
          )}
          interaction={onCardClick ? "lift" : "static"}
          onClick={onCardClick}
          onKeyDown={handleKeyDown}
          role={onCardClick ? "button" : undefined}
          style={cardStyle}
          tabIndex={onCardClick ? 0 : undefined}
          {...props}
        >
          {hasMedia && <div aria-hidden="true" className={overlayVariants({ overlay })} />}
          {author && layout === "overlay" && (
            <OverlayAuthor
              author={author}
              metadata={metadata}
              subtitleColor={subtitleColor}
              textColor={textColor}
            />
          )}
          <div
            className={cn(
              contentCardStyles.contentCard,
              layout === "stacked"
                ? contentCardStyles.contentCard2
                : contentCardStyles.contentCard3,
            )}
          >
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
            {children && <div className={contentCardStyles.element12}>{children}</div>}
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

export type { Author, ContentCardProps } from "../types";
