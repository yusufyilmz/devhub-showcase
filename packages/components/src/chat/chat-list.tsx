/**
 * ChatList - Pure UI scrollable message container
 * No business logic - just presentation
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Button } from "@shared/ui/button";
import { ScrollableContainer } from "@shared/ui/scrollable-container";

const chatListVariants = cva("relative", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "bg-background",
      muted: "bg-muted/30",
    },
  },
});

export interface ChatListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatListVariants> {
  /** Loading state */
  loading?: boolean;
  /** Load more button text */
  loadMoreText?: string;
  /** Called when load more is clicked */
  onLoadMore?: () => void;
  /** Called when scroll to bottom is clicked */
  onScrollToBottom?: () => void;
  /** Scroll to bottom button text */
  scrollButtonText?: string;
  /** Show load more button at top */
  showLoadMore?: boolean;
  /** Show scroll to bottom button */
  showScrollButton?: boolean;
}

export const ChatList = React.forwardRef<HTMLDivElement, ChatListProps>(
  (
    {
      className,
      variant,
      children,
      showScrollButton = true,
      scrollButtonText = "↓",
      onScrollToBottom,
      showLoadMore = false,
      loadMoreText = "Load older messages",
      onLoadMore,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const [showScroll, setShowScroll] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const isAtBottom =
        Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;
      setShowScroll(!isAtBottom);
    }, []);

    const handleScrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      onScrollToBottom?.();
    };

    return (
      <div
        className={cn(chatListVariants({ variant }), "relative", className)}
        ref={ref}
        {...props}
      >
        <ScrollableContainer className="h-full" onScroll={handleScroll}>
          <div className="flex flex-col p-4" ref={scrollRef}>
            {/* Load More Button */}
            {showLoadMore && (
              <div className="flex justify-center py-4">
                <Button disabled={loading} onClick={onLoadMore} size="sm" variant="outline">
                  {loading ? "Loading..." : loadMoreText}
                </Button>
              </div>
            )}

            {/* Messages */}
            {children}
          </div>
        </ScrollableContainer>

        {/* Scroll to Bottom Button */}
        {showScrollButton && showScroll && (
          <Button
            className="absolute bottom-4 right-4 size-10 rounded-full shadow-lg z-10"
            onClick={handleScrollToBottom}
            size="icon"
            variant="default"
          >
            {scrollButtonText}
          </Button>
        )}
      </div>
    );
  },
);
ChatList.displayName = "ChatList";

/**
 * ChatListItem - Individual item in chat list
 */
export interface ChatListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show hover effects */
  hoverable?: boolean;
  /** Is this message from the current user */
  isOwn?: boolean;
}

export const ChatListItem = React.forwardRef<HTMLDivElement, ChatListItemProps>(
  ({ className, isOwn = false, hoverable = true, ...props }, ref) => {
    return (
      <div
        className={cn(
          "py-2 transition-colors",
          hoverable && "hover:bg-muted/30",
          isOwn && "flex justify-end",
          className,
        )}
        data-slot="chat-list-item"
        ref={ref}
        {...props}
      />
    );
  },
);
ChatListItem.displayName = "ChatListItem";

/**
 * ChatListSeparator - Date/time separator
 */
export interface ChatListSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const ChatListSeparator = React.forwardRef<HTMLDivElement, ChatListSeparatorProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center justify-center gap-4 py-4", className)}
        data-slot="chat-list-separator"
        ref={ref}
        {...props}
      >
        <div className="h-px flex-1 bg-border max-w-24" />
        <span className="text-xs text-muted-foreground font-medium px-4">{label}</span>
        <div className="h-px flex-1 bg-border max-w-24" />
      </div>
    );
  },
);
ChatListSeparator.displayName = "ChatListSeparator";

/**
 * ChatListEmpty - Empty state
 */
export interface ChatListEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: string;
  icon?: React.ReactNode;
  title?: string;
}

export const ChatListEmpty = React.forwardRef<HTMLDivElement, ChatListEmptyProps>(
  (
    {
      className,
      icon = "💬",
      title = "No messages yet",
      description = "Start the conversation!",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full text-center py-12",
          className,
        )}
        data-slot="chat-list-empty"
        ref={ref}
        {...props}
      >
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  },
);
ChatListEmpty.displayName = "ChatListEmpty";
