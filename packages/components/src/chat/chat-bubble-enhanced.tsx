/**
 * Enhanced ChatBubble - With AppearanceCard features
 * Adds hover effects, glass morphism, and animations
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { AppearanceCard } from "@shared/ui/cards";
import { convertSystemProps, extractSystemProps, type SystemProps } from "@shared/ui/utils";

const chatBubbleVariants = cva("break-words transition-all", {
  defaultVariants: {
    size: "md",
    variant: "received",
  },
  variants: {
    size: {
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
    },
    variant: {
      received: "bg-card border-border",
      sent: "ml-auto bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md",
      system: "bg-accent/30 text-accent-foreground text-center italic backdrop-blur-sm",
    },
  },
});

export interface EnhancedChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants>,
    SystemProps {
  /** Enable glow effect on hover */
  enableGlow?: boolean;
  /** Enable hover effects */
  enableHover?: boolean;
  /** Show glass morphism effect */
  glassEffect?: boolean;
  /** Maximum width of the bubble */
  maxWidth?: string;
}

export const EnhancedChatBubble = React.forwardRef<HTMLDivElement, EnhancedChatBubbleProps>(
  (
    {
      className,
      variant,
      size,
      enableHover = true,
      enableGlow = false,
      maxWidth = "75%",
      glassEffect = false,
      ...props
    },
    ref,
  ) => {
    const [systemProps, otherProps] = extractSystemProps(props);
    const systemStyles = convertSystemProps(systemProps);

    return (
      <AppearanceCard
        appearance={variant === "system" ? "subtle" : "default"}
        className={cn(chatBubbleVariants({ size, variant }), "rounded-2xl px-4 py-3", className)}
        data-slot="chat-bubble-enhanced"
        enableGlow={enableGlow}
        enableHover={enableHover && variant !== "system"}
        hoverScale={1.01}
        hoverTranslateY={-1}
        ref={ref}
        style={{
          ...systemStyles,
          maxWidth,
        }}
        transitionDuration={200}
        {...otherProps}
      />
    );
  },
);
EnhancedChatBubble.displayName = "EnhancedChatBubble";

/**
 * EnhancedChatBubbleGroup - Container for grouped messages
 */
export interface EnhancedChatBubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center";
  /** Add subtle animation on mount */
  animate?: boolean;
}

export const EnhancedChatBubbleGroup = React.forwardRef<
  HTMLDivElement,
  EnhancedChatBubbleGroupProps
>(({ className, align = "left", animate = true, ...props }, ref) => {
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
});
EnhancedChatBubbleGroup.displayName = "EnhancedChatBubbleGroup";

/**
 * EnhancedChatBubbleTimestamp - Timestamp with better styling
 */
export interface EnhancedChatBubbleTimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show with icon */
  showIcon?: boolean;
  time: string;
}

export const EnhancedChatBubbleTimestamp = React.forwardRef<
  HTMLSpanElement,
  EnhancedChatBubbleTimestampProps
>(({ className, time, showIcon = false, ...props }, ref) => {
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
});
EnhancedChatBubbleTimestamp.displayName = "EnhancedChatBubbleTimestamp";

/**
 * EnhancedChatBubbleReactions - Reactions with StyledIconButton
 */
export interface EnhancedChatBubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onReactionClick?: (emoji: string) => void;
  reactions: Array<{ emoji: string; count: number; active?: boolean }>;
}

export const EnhancedChatBubbleReactions = React.forwardRef<
  HTMLDivElement,
  EnhancedChatBubbleReactionsProps
>(({ className, reactions, onReactionClick, ...props }, ref) => {
  return (
    <div
      className={cn("flex flex-wrap gap-1.5 mt-2", className)}
      data-slot="chat-bubble-reactions-enhanced"
      ref={ref}
      {...props}
    >
      {reactions.map(({ emoji, count, active }) => (
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-200",
            "hover:scale-110 hover:-translate-y-0.5",
            active
              ? "bg-primary/15 border-primary/30 text-primary shadow-sm"
              : "bg-card border-border hover:bg-muted hover:border-primary/20",
          )}
          key={emoji}
          onClick={() => onReactionClick?.(emoji)}
        >
          <span className="text-base leading-none">{emoji}</span>
          <span className={cn("font-medium", active ? "text-primary" : "text-muted-foreground")}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
});

EnhancedChatBubbleReactions.displayName = "EnhancedChatBubbleReactions";
