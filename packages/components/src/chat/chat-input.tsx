/**
 * ChatInput - Pure UI input component for chat
 * Controlled component - all logic handled by parent
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";

const chatInputVariants = cva(
  "flex flex-col gap-2 border-t border-border bg-background/95 backdrop-blur-sm transition-all",
  {
    defaultVariants: {
      size: "md",
    },
    variants: {
      size: {
        lg: "p-6",
        md: "p-4",
        sm: "p-2",
      },
    },
  },
);

export interface ChatInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "onChange" | "onSubmit">,
    VariantProps<typeof chatInputVariants> {
  /** Container class name */
  containerClassName?: string;
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
  /** Send button text */
  sendButtonText?: string;
  /** Show character count */
  showCharacterCount?: boolean;
  /** Show send button */
  showSendButton?: boolean;
  /** Value of the input (controlled) */
  value: string;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
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
      size,
      containerClassName,
      className,
      disabled,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && onSubmit) {
          onSubmit(value.trim());
        }
      }

      onKeyDown?.(e);
    };

    const handleSubmit = () => {
      if (value.trim() && onSubmit) {
        onSubmit(value.trim());
      }
    };

    const isNearLimit = maxLength && value.length > maxLength * 0.9;
    const isOverLimit = maxLength && value.length >= maxLength;

    return (
      <div className={cn(chatInputVariants({ size }), containerClassName)}>
        {/* Input Area */}
        <div className="relative">
          <Textarea
            className={cn(
              "resize-none min-h-[44px] max-h-[200px] pr-12",
              isOverLimit && "border-destructive",
              className,
            )}
            disabled={disabled}
            maxLength={maxLength}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={ref}
            value={value}
            {...props}
          />

          {/* Character Count */}
          {(showCharacterCount || isNearLimit) && maxLength && (
            <span
              className={cn(
                "absolute bottom-2 right-2 text-xs transition-colors",
                isOverLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {value.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Actions */}
          <div className="flex items-center gap-1">{leftActions}</div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {rightActions}

            {/* Send Button */}
            {showSendButton && (
              <Button
                className="gap-2"
                disabled={!value.trim() || Boolean(isOverLimit) || disabled}
                onClick={handleSubmit}
                size="sm"
              >
                {sendButtonText}
                <span aria-hidden="true" className="text-base">
                  →
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ChatInput.displayName = "ChatInput";

/**
 * ChatInputAction - Action button for chat input
 */
export interface ChatInputActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
}

export const ChatInputAction = React.forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ icon, label, className, children, ...props }, ref) => {
    return (
      <Button
        aria-label={label}
        className={cn("size-9", className)}
        ref={ref}
        size="icon"
        variant="ghost"
        {...props}
      >
        {icon || children}
      </Button>
    );
  },
);
ChatInputAction.displayName = "ChatInputAction";
