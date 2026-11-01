/**
 * ChatTyping - Pure UI typing indicator
 * No business logic - just animated dots
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const chatTypingVariants = cva("flex items-center gap-1", {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: "gap-1.5",
      md: "gap-1",
      sm: "gap-0.5",
    },
  },
});

const dotVariants = cva("rounded-full bg-current animate-bounce", {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: "size-2",
      md: "size-1.5",
      sm: "size-1",
    },
  },
});

export interface ChatTypingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatTypingVariants> {
  /** Bubble color */
  bubbleColor?: string;
  /** Show in bubble */
  showBubble?: boolean;
}

export const ChatTyping = React.forwardRef<HTMLDivElement, ChatTypingProps>(
  ({ className, size, showBubble = false, bubbleColor, ...props }, ref) => {
    const dots = (
      <div className={cn(chatTypingVariants({ size }), className)} {...props}>
        <span
          aria-hidden="true"
          className={cn(dotVariants({ size }))}
          style={{ animationDelay: "0ms" }}
        />
        <span
          aria-hidden="true"
          className={cn(dotVariants({ size }))}
          style={{ animationDelay: "150ms" }}
        />
        <span
          aria-hidden="true"
          className={cn(dotVariants({ size }))}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );

    if (showBubble) {
      return (
        <div
          aria-label="Typing..."
          className={cn(
            "inline-flex items-center px-4 py-3 rounded-lg",
            bubbleColor || "bg-muted text-muted-foreground",
          )}
          data-slot="chat-typing"
          ref={ref}
          role="img"
        >
          {dots}
        </div>
      );
    }

    return (
      <div aria-label="Typing..." data-slot="chat-typing" ref={ref} role="img" title="Typing...">
        {dots}
      </div>
    );
  },
);
ChatTyping.displayName = "ChatTyping";

/**
 * ChatTypingText - Typing indicator with text
 */
export interface ChatTypingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ChatTypingProps["size"];
  /** Custom text */
  text?: string;
  /** User or users typing */
  users?: string | string[];
}

export const ChatTypingText = React.forwardRef<HTMLDivElement, ChatTypingTextProps>(
  ({ className, users, text, size = "sm", ...props }, ref) => {
    const typingText = React.useMemo(() => {
      if (text) return text;

      if (!users) return "Someone is typing...";

      if (typeof users === "string") {
        return `${users} is typing...`;
      }

      if (users.length === 1) {
        return `${users[0]} is typing...`;
      }

      if (users.length === 2) {
        return `${users[0]} and ${users[1]} are typing...`;
      }

      return `${users[0]} and ${users.length - 1} others are typing...`;
    }, [users, text]);

    return (
      <div
        className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}
        data-slot="chat-typing-text"
        ref={ref}
        {...props}
      >
        <span className="font-medium">{typingText}</span>
        <ChatTyping size={size} />
      </div>
    );
  },
);
ChatTypingText.displayName = "ChatTypingText";
