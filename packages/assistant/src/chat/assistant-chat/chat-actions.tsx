/**
 * ChatMessageActions - Pure UI action buttons for messages
 * No business logic - just presentation
 */

import React from "react";

import { cn } from "cn";

import { Button } from "@shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip";

export interface ChatMessageAction {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export interface ChatMessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: ChatMessageAction[];
  /** Alignment */
  align?: "left" | "right";
  /** Position */
  position?: "top" | "bottom";
  /** Show actions */
  visible?: boolean;
}

export const ChatMessageActions = React.forwardRef<HTMLDivElement, ChatMessageActionsProps>(
  ({ className, actions, visible = true, position = "top", align = "right", ...props }, ref) => {
    return (
      <div
        className={cn(
          "absolute flex items-center gap-1 p-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg transition-opacity",
          !visible && "opacity-0 pointer-events-none",
          position === "top" && "-top-3",
          position === "bottom" && "-bottom-3",
          align === "left" && "left-0",
          align === "right" && "right-0",
          className,
        )}
        data-slot="chat-message-actions"
        ref={ref}
        {...props}
      >
        {actions.map((action, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                aria-label={action.label}
                className={cn(
                  "size-8",
                  action.variant === "destructive" &&
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                )}
                disabled={action.disabled}
                onClick={action.onClick}
                size="icon"
                variant="ghost"
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  },
);
ChatMessageActions.displayName = "ChatMessageActions";

/**
 * ChatMessageActionGroup - Grouped actions with dividers
 */
export interface ChatMessageActionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: ChatMessageAction[][];
}

export const ChatMessageActionGroup = React.forwardRef<HTMLDivElement, ChatMessageActionGroupProps>(
  ({ className, groups, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg",
          className,
        )}
        data-slot="chat-message-action-group"
        ref={ref}
        {...props}
      >
        {groups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className="h-4 w-px bg-border" />}

            <div className="flex items-center gap-1">
              {group.map((action, actionIndex) => (
                <Tooltip key={actionIndex}>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label={action.label}
                      className={cn(
                        "size-8",
                        action.variant === "destructive" &&
                          "text-destructive hover:bg-destructive/10 hover:text-destructive",
                      )}
                      disabled={action.disabled}
                      onClick={action.onClick}
                      size="icon"
                      variant="ghost"
                    >
                      {action.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{action.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  },
);
ChatMessageActionGroup.displayName = "ChatMessageActionGroup";

/**
 * Quick Emoji Reactions
 */
export interface ChatQuickReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  emojis?: string[];
  onReact?: (emoji: string) => void;
}

export const ChatQuickReactions = React.forwardRef<HTMLDivElement, ChatQuickReactionsProps>(
  ({ className, emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"], onReact, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg",
          className,
        )}
        data-slot="chat-quick-reactions"
        ref={ref}
        {...props}
      >
        {emojis.map((emoji) => (
          <Button
            className="size-8 text-base hover:scale-125 transition-transform"
            key={emoji}
            onClick={() => onReact?.(emoji)}
            size="icon"
            variant="ghost"
          >
            {emoji}
          </Button>
        ))}
      </div>
    );
  },
);
ChatQuickReactions.displayName = "ChatQuickReactions";
