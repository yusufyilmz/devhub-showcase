import React from "react";

import { cn } from "cn";

import { Button as LibraryButton } from "@shared/ui/button";

export { ChatBubble, type ChatBubbleProps } from "../chat-bubble/index";

/**
 * ChatBubbleGroup - Container for grouped messages
 */
export interface ChatBubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center";
  /** Add subtle animation on mount */
  animate?: boolean;
}

export const ChatBubbleGroup = React.forwardRef<HTMLDivElement, ChatBubbleGroupProps>(
  ({ className, align = "left", animate = true, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-2",
          align === "left" && "items-start",
          align === "right" && "items-end",
          align === "center" && "items-center",
          animate && "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
          className,
        )}
        data-slot="chat-bubble-group-enhanced"
        ref={ref}
        {...props}
      />
    );
  },
);
ChatBubbleGroup.displayName = "ChatBubbleGroup";

/**
 * ChatBubbleTimestamp - Timestamp with better styling
 */
export interface ChatBubbleTimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show with icon */
  showIcon?: boolean;
  time: string;
}

export const ChatBubbleTimestamp = React.forwardRef<HTMLSpanElement, ChatBubbleTimestampProps>(
  ({ className, time, showIcon = false, ...props }, ref) => {
    return (
      <span
        className={cn(
          "text-xs text-muted-foreground font-medium px-2 flex items-center gap-1",
          className,
        )}
        data-slot="chat-bubble-timestamp-enhanced"
        ref={ref}
        {...props}
      >
        {showIcon && <span className="opacity-50">🕐</span>}
        {time}
      </span>
    );
  },
);
ChatBubbleTimestamp.displayName = "ChatBubbleTimestamp";

/**
 * ChatBubbleReactions - Reactions with StyledIconButton
 */
export interface ChatBubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onReactionClick?: (emoji: string) => void;
  reactions: Array<{ emoji: string; count: number; active?: boolean }>;
}

export const ChatBubbleReactions = React.forwardRef<HTMLDivElement, ChatBubbleReactionsProps>(
  ({ className, reactions, onReactionClick, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-wrap gap-1.5 mt-2", className)}
        data-slot="chat-bubble-reactions-enhanced"
        ref={ref}
        {...props}
      >
        {reactions.map(({ emoji, count, active }) => (
          <LibraryButton
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-200",
              "hover:scale-110 hover:-translate-y-0.5",
              active
                ? "bg-primary/15 border-primary/30 text-primary shadow-sm"
                : "bg-card border-border hover:bg-muted hover:border-primary/20",
            )}
            key={emoji}
            onClick={() => onReactionClick?.(emoji)}
            variant="unstyled"
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className={cn("font-medium", active ? "text-primary" : "text-muted-foreground")}>
              {count}
            </span>
          </LibraryButton>
        ))}
      </div>
    );
  },
);

ChatBubbleReactions.displayName = "ChatBubbleReactions";
