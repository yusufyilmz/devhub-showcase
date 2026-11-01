/**
 * ChatBubble - Pure UI message bubble component
 * No business logic - just presentation
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { convertSystemProps, extractSystemProps, type SystemProps } from "@shared/ui/utils";

const chatBubbleVariants = cva("relative rounded-lg px-4 py-2 break-words transition-all", {
  defaultVariants: {
    rounded: "md",
    size: "md",
    variant: "received",
  },
  variants: {
    rounded: {
      full: "rounded-3xl",
      lg: "rounded-xl",
      md: "rounded-lg",
      sm: "rounded-sm",
    },
    size: {
      lg: "text-lg px-5 py-3",
      md: "text-base px-4 py-2",
      sm: "text-sm px-3 py-1.5",
    },
    variant: {
      received: "bg-muted text-foreground",
      sent: "bg-primary text-primary-foreground ml-auto",
      system: "bg-accent/50 text-accent-foreground text-center italic",
    },
  },
});

export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants>,
    SystemProps {
  /** Maximum width of the bubble */
  maxWidth?: string;
  /** Position of the tail/arrow */
  showTail?: boolean;
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, size, rounded, showTail = false, maxWidth, ...props }, ref) => {
    const [systemProps, otherProps] = extractSystemProps(props);
    const systemStyles = convertSystemProps(systemProps);

    return (
      <div
        className={cn(
          chatBubbleVariants({ rounded, size, variant }),
          maxWidth && "max-w-[--max-width]",
          className,
        )}
        data-slot="chat-bubble"
        ref={ref}
        style={{
          ...systemStyles,
          ...(maxWidth && { "--max-width": maxWidth }),
        }}
        {...otherProps}
      />
    );
  },
);
ChatBubble.displayName = "ChatBubble";

/**
 * ChatBubbleGroup - Container for grouped messages
 */
export interface ChatBubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center";
}

export const ChatBubbleGroup = React.forwardRef<HTMLDivElement, ChatBubbleGroupProps>(
  ({ className, align = "left", ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-1",
          align === "left" && "items-start",
          align === "right" && "items-end",
          align === "center" && "items-center",
          className,
        )}
        data-slot="chat-bubble-group"
        ref={ref}
        {...props}
      />
    );
  },
);
ChatBubbleGroup.displayName = "ChatBubbleGroup";

/**
 * ChatBubbleTimestamp - Timestamp display
 */
export interface ChatBubbleTimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
  time: string;
}

export const ChatBubbleTimestamp = React.forwardRef<HTMLSpanElement, ChatBubbleTimestampProps>(
  ({ className, time, ...props }, ref) => {
    return (
      <span
        className={cn("text-xs text-muted-foreground px-2", className)}
        data-slot="chat-bubble-timestamp"
        ref={ref}
        {...props}
      >
        {time}
      </span>
    );
  },
);
ChatBubbleTimestamp.displayName = "ChatBubbleTimestamp";

/**
 * ChatBubbleReactions - Reaction display
 */
export interface ChatBubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onReactionClick?: (emoji: string) => void;
  reactions: Array<{ emoji: string; count: number; active?: boolean }>;
}

export const ChatBubbleReactions = React.forwardRef<HTMLDivElement, ChatBubbleReactionsProps>(
  ({ className, reactions, onReactionClick, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-wrap gap-1 mt-1", className)}
        data-slot="chat-bubble-reactions"
        ref={ref}
        {...props}
      >
        {reactions.map(({ emoji, count, active }) => (
          <button
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors",
              active
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border hover:bg-muted",
            )}
            key={emoji}
            onClick={() => onReactionClick?.(emoji)}
          >
            <span>{emoji}</span>
            <span className="text-muted-foreground">{count}</span>
          </button>
        ))}
      </div>
    );
  },
);
ChatBubbleReactions.displayName = "ChatBubbleReactions";
