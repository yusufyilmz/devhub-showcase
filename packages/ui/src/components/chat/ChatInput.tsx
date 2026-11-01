"use client";

import type * as React from "react";

import { cn } from "cn";

import { Button } from "../button";
import { FlexCol, FlexRow } from "../flex";
import { TextField } from "../text-field";
import { Typography } from "../typography";

export interface ChatInputProps {
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onClear?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  placeholder?: string;
  showCharacterCount?: boolean;
  showClearButton?: boolean;
  value: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  placeholder = "Type a message...",
  maxLength = 1000,
  disabled = false,
  showCharacterCount = true,
  showClearButton = true,
  onClear,
  fullWidth,
  className,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    onKeyPress?.(e);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className={cn(
        "w-full p-[var(--spacing-lg)] bg-gradient-to-r from-[var(--background)] to-[var(--card)] backdrop-blur-xl shadow-[var(--shadow-sm)] relative overflow-hidden",
        fullWidth && "w-full",
        className,
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-30" />
      <FlexCol className="w-full relative z-10" gap="sm">
        <FlexRow align="end" gap="sm">
          <TextField
            className="resize-none min-h-[120px] rounded-[var(--radius-lg)] border-2 border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 bg-[var(--background)]/90 backdrop-blur-sm shadow-[var(--shadow-sm)]"
            disabled={disabled}
            fullWidth
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            value={value}
          />
          <Button
            className="px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/80"
            disabled={!canSend}
            onClick={onSend}
            size="lg"
          >
            <Typography className="font-semibold text-[var(--primary-foreground)]" variant="body2">
              Send
            </Typography>
          </Button>
        </FlexRow>

        {value && (
          <FlexRow align="center" justify="between">
            {showCharacterCount && (
              <Typography className="text-[var(--muted-foreground)]" variant="caption">
                {value.length}/{maxLength}
              </Typography>
            )}
            {showClearButton && (
              <FlexRow gap="xs">
                <Button
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  onClick={handleClear}
                  size="sm"
                  variant="ghost"
                >
                  <Typography variant="caption">Clear</Typography>
                </Button>
              </FlexRow>
            )}
          </FlexRow>
        )}
      </FlexCol>
    </div>
  );
}
