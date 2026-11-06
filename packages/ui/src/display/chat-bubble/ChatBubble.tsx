"use client";

import "../../styles/components/display/chat-bubble/chat-bubble.css";

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { AppearanceCard } from "../../cards";
import { convertSystemProps, extractSystemProps, type SystemProps } from "../../utils";

const chatBubbleVariants = cva("chat-bubble-surface break-words transition-all", {
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

export interface ChatBubbleProps
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

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
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
ChatBubble.displayName = "ChatBubble";
