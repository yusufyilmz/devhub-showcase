/**
 * Enhanced ChatInput - With StyledTextField and ActionButton
 * Premium styling with glass morphism and smooth animations
 */

import React from "react";


import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Send } from "lucide-react";

import { ActionButton } from "@shared/ui/action-button";
import { StyledIconButton } from "@shared/ui/icon-button";
import { StyledTextField } from "@shared/ui/text-field";

const chatInputContainerVariants = cva(
  "flex flex-col gap-3 border-t backdrop-blur-md transition-all",
  {
    defaultVariants: {
      size: "md",
      variant: "default",
    },
    variants: {
      size: {
        lg: "p-6",
        md: "p-4",
        sm: "p-3",
      },
      variant: {
        default: "border-border bg-background/95",
        glass: "border-border/50 bg-background/80",
        minimal: "border-border/30 bg-transparent",
      },
    },
  },
);

export interface ChatInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "onSubmit">,
    VariantProps<typeof chatInputContainerVariants> {
  /** Container class name */
  containerClassName?: string;
  /** Use glass effect for input */
  glassInput?: boolean;
  /** Left action buttons */
  leftActions?: React.ReactNode;
  /** Maximum characters allowed */
  maxLength?: number;
  /** Submit handler */
  onSubmit?: (value: string) => void;
  /** Change handler */
  onValueChange?: (value: string) => void;
  /** Right action buttons (before send) */
  rightActions?: React.ReactNode;
  /** Send button color */
  sendButtonColor?: "primary" | "success" | "info";
  /** Send button text */
  sendButtonText?: string;
  /** Show character count */
  showCharacterCount?: boolean;
  /** Show send button */
  showSendButton?: boolean;
  /** Value of the input (controlled) */
  value: string;
}

export const ChatInput = React.forwardRef<HTMLInputElement, ChatInputProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      showSendButton = true,
      sendButtonText = "Send",
      leftActions,
      rightActions,
      maxLength = 5000,
      showCharacterCount = false,
      variant = "default",
      size,
      containerClassName,
      className,
      glassInput = false,
      sendButtonColor = "primary",
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && onSubmit) {
          onSubmit(value.trim());
        }
      }
    };

    const handleSubmit = () => {
      if (value.trim() && onSubmit) {
        onSubmit(value.trim());
      }
    };

    const isNearLimit = maxLength && value.length > maxLength * 0.9;
    const isOverLimit = maxLength && value.length >= maxLength;

    return (
      <div className={cn(chatInputContainerVariants({ size, variant }), containerClassName)}>
        {/* Input Area */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <StyledTextField
              className={cn("resize-none", className)}
              error={isOverLimit ? "Message too long" : undefined}
              maxLength={maxLength}
              onChange={handleChange}
              onKeyDown={(event) => {
                handleKeyDown(event);
                onKeyDown?.(event);
              }}
              placeholder={props.placeholder || "Type a message..."}
              ref={ref}
              value={value}
              variant={glassInput ? "glass" : variant === "glass" ? "glass" : "standard"}
              {...props}
            />

            {/* Character Count */}
            {(showCharacterCount || isNearLimit) && maxLength && (
              <span
                className={cn(
                  "absolute bottom-3 right-3 text-xs font-medium transition-colors pointer-events-none",
                  isOverLimit ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {value.length}/{maxLength}
              </span>
            )}
          </div>

          {/* Send Button */}
          {showSendButton && (
            <ActionButton
              className="shrink-0 gap-2 px-6"
              colorScheme={sendButtonColor}
              disabled={!value.trim() || isOverLimit || undefined}
              onClick={handleSubmit}
              size="lg"
            >
              {sendButtonText}
              <Send className="h-4 w-4" />
            </ActionButton>
          )}
        </div>

        {/* Action Buttons Row */}
        {(leftActions || rightActions) && (
          <div className="flex items-center justify-between gap-2">
            {/* Left Actions */}
            <div className="flex items-center gap-1">{leftActions}</div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">{rightActions}</div>
          </div>
        )}
      </div>
    );
  },
);
ChatInput.displayName = "ChatInput";

/**
 * ChatInputAction - Icon button action
 */
export interface ChatInputActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  badge?: number;
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default";
  icon?: React.ReactNode;
  label?: string;
}

export const ChatInputAction = React.forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ icon, label, colorScheme = "default", badge, className, children, ...props }, ref) => {
    return (
      <StyledIconButton
        aria-label={label}
        badgeCount={badge}
        className={cn("size-9", className)}
        colorScheme={colorScheme}
        ref={ref}
        size="icon"
        variant="ghost"
        {...props}
      >
        {icon || children}
      </StyledIconButton>
    );
  },
);
ChatInputAction.displayName = "ChatInputAction";
