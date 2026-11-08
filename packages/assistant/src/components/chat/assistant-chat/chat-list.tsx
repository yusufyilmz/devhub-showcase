/**
 * Enhanced ChatList - With Paper and smooth animations
 * Premium background and scroll effects
 */

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { ActionButton } from "@shared/ui/action-button";
import { StyledIconButton } from "@shared/ui/icon-button";
import { ChevronDownIcon, Loader2Icon } from "@shared/ui/icons";
import { Paper } from "@shared/ui/paper";
import { ScrollableContainer } from "@shared/ui/scrollable-container";

const chatListVariants = cva("relative", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "bg-background",
      glass: "bg-background/80 backdrop-blur-md",
      muted: "bg-muted/20",
    },
  },
});

export interface ChatListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatListVariants> {
  /** Use glass effect for background */
  glassEffect?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Load more button text */
  loadMoreText?: string;
  /** Called when load more is clicked */
  onLoadMore?: () => void;
  /** Called when scroll to bottom is clicked */
  onScrollToBottom?: () => void;
  /** Show gradient fade at bottom */
  showBottomFade?: boolean;
  /** Show load more button at top */
  showLoadMore?: boolean;
  /** Show scroll to bottom button */
  showScrollButton?: boolean;
  /** Show gradient fade at top */
  showTopFade?: boolean;
}

export const ChatList = React.forwardRef<HTMLDivElement, ChatListProps>(
  (
    {
      className,
      variant,
      children,
      showScrollButton = true,
      onScrollToBottom,
      showLoadMore = false,
      loadMoreText = "Load older messages",
      onLoadMore,
      loading = false,
      glassEffect = false,
      showTopFade = true,
      showBottomFade = true,
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
        scrollRef.current.scrollTo({
          behavior: "smooth",
          top: scrollRef.current.scrollHeight,
        });
      }
      onScrollToBottom?.();
    };

    return (
      <Paper
        className={cn(chatListVariants({ variant }), "relative overflow-hidden", className)}
        glassEffect={glassEffect}
        ref={ref}
        spacing="none"
        {...props}
      >
        {/* Top Fade */}
        {showTopFade && (
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
        )}

        <ScrollableContainer className="h-full" onScroll={handleScroll}>
          <div className="flex flex-col p-4 gap-1" ref={scrollRef}>
            {/* Load More Button */}
            {showLoadMore && (
              <div className="flex justify-center py-4">
                <ActionButton
                  className="gap-2"
                  colorScheme="primary"
                  disabled={loading}
                  onClick={onLoadMore}
                  size="sm"
                  variant="outlined"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    loadMoreText
                  )}
                </ActionButton>
              </div>
            )}

            {/* Messages */}
            {children}
          </div>
        </ScrollableContainer>

        {/* Bottom Fade */}
        {showBottomFade && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        )}

        {/* Scroll to Bottom Button */}
        {showScrollButton && showScroll && (
          <StyledIconButton
            animated={true}
            className="fixed bottom-20 right-6 size-12 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
            elevated={true}
            onClick={handleScrollToBottom}
            variant="default"
          >
            <ChevronDownIcon />
          </StyledIconButton>
        )}
      </Paper>
    );
  },
);
ChatList.displayName = "ChatList";

/**
 * ChatListItem - Individual item with animations
 */
export interface ChatListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animate on mount */
  animate?: boolean;
  /** Show hover effects */
  hoverable?: boolean;
  /** Is this message from the current user */
  isOwn?: boolean;
}

export const ChatListItem = React.forwardRef<HTMLDivElement, ChatListItemProps>(
  ({ className, isOwn = false, hoverable = true, animate = true, ...props }, ref) => {
    return (
      <div
        className={cn(
          "py-2 transition-all duration-200",
          hoverable && "hover:bg-muted/20 rounded-lg px-2 -mx-2",
          isOwn && "flex justify-end",
          animate && "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
          className,
        )}
        data-slot="chat-list-item-enhanced"
        ref={ref}
        {...props}
      />
    );
  },
);
ChatListItem.displayName = "ChatListItem";

/**
 * ChatListSeparator - Date/time separator with style
 */
export interface ChatListSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  sticky?: boolean;
}

export const ChatListSeparator = React.forwardRef<HTMLDivElement, ChatListSeparatorProps>(
  ({ className, label, sticky = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-4 py-6",
          sticky && "sticky top-0 bg-background/95 backdrop-blur-sm z-10",
          className,
        )}
        data-slot="chat-list-separator-enhanced"
        ref={ref}
        {...props}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent max-w-32" />
        <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase px-4 bg-muted/50 rounded-full py-1">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent max-w-32" />
      </div>
    );
  },
);
ChatListSeparator.displayName = "ChatListSeparator";

/**
 * ChatListEmpty - Empty state with style
 */
export interface ChatListEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
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
      action,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full text-center py-16 animate-in fade-in-0 zoom-in-95 duration-500",
          className,
        )}
        data-slot="chat-list-empty-enhanced"
        ref={ref}
        {...props}
      >
        <div className="text-7xl mb-6 animate-bounce">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  },
);
ChatListEmpty.displayName = "ChatListEmpty";
