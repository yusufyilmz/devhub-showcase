/**
 * ChatAvatar - Pure UI avatar component for chat
 * Extends base Avatar with online status and typing indicator
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";

const chatAvatarVariants = cva("relative", {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: "size-12",
      md: "size-10",
      sm: "size-8",
      xl: "size-16",
      xs: "size-6",
    },
  },
});

export interface ChatAvatarProps extends VariantProps<typeof chatAvatarVariants> {
  alt?: string;
  className?: string;
  fallback?: string;
  online?: boolean;
  src?: string;
  typing?: boolean;
}

export const ChatAvatar = React.forwardRef<HTMLDivElement, ChatAvatarProps>(
  ({ src, alt, fallback, online, typing, size, className }, ref) => {
    return (
      <div className={cn(chatAvatarVariants({ size }), className)} ref={ref}>
        <Avatar className="size-full">
          {src && <AvatarImage alt={alt} src={src} />}
          <AvatarFallback>{fallback || "?"}</AvatarFallback>
        </Avatar>

        {/* Online Status Badge */}
        {online !== undefined && (
          <span
            aria-label={online ? "Online" : "Offline"}
            className={cn(
              "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
              online ? "bg-success" : "bg-muted-foreground/50",
              online && "animate-pulse",
            )}
            role="img"
          />
        )}

        {/* Typing Indicator */}
        {typing && (
          <span
            aria-label="Typing..."
            className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]"
            role="img"
          >
            <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
            <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
          </span>
        )}
      </div>
    );
  },
);
ChatAvatar.displayName = "ChatAvatar";

/**
 * ChatAvatarGroup - Display multiple avatars in a group
 */
export interface ChatAvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: ChatAvatarProps["size"];
}

export const ChatAvatarGroup = React.forwardRef<HTMLDivElement, ChatAvatarGroupProps>(
  ({ avatars, max = 3, size = "sm", className, ...props }, ref) => {
    const displayAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
      <div
        className={cn("flex -space-x-2", className)}
        data-slot="chat-avatar-group"
        ref={ref}
        {...props}
      >
        {displayAvatars.map((avatar, index) => (
          <div
            className="ring-2 ring-background rounded-full"
            key={index}
            style={{ zIndex: displayAvatars.length - index }}
          >
            <ChatAvatar size={size} {...avatar} />
          </div>
        ))}

        {remaining > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background",
              size === "xs" && "size-6 text-[10px]",
              size === "sm" && "size-8 text-xs",
              size === "md" && "size-10 text-sm",
              size === "lg" && "size-12 text-base",
              size === "xl" && "size-16 text-lg",
            )}
            style={{ zIndex: 0 }}
          >
            +{remaining}
          </div>
        )}
      </div>
    );
  },
);
ChatAvatarGroup.displayName = "ChatAvatarGroup";
