"use client";

import type * as React from "react";

import { cn } from "cn";

import { Button } from "../../buttons/button";
import { TextField } from "../../forms/text-field";
import { FlexCol, FlexRow } from "../../layout/flex";
import { Typography } from "../typography";
import { chatInputStyles } from "./styles";
import type { ChatInputProps } from "./types";

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
      className={cn(chatInputStyles.chatInput, fullWidth && chatInputStyles.chatInput2, className)}
    >
      {/* Subtle background pattern */}
      <div className={chatInputStyles.element1} />
      <FlexCol className={chatInputStyles.element2} gap="sm">
        <FlexRow align="end" gap="sm">
          <TextField
            className={chatInputStyles.element3}
            disabled={disabled}
            fullWidth
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            value={value}
          />
          <Button
            className={chatInputStyles.element4}
            disabled={!canSend}
            onClick={onSend}
            size="lg"
          >
            <Typography className={chatInputStyles.element5} variant="body2">
              Send
            </Typography>
          </Button>
        </FlexRow>

        {value && (
          <FlexRow align="center" justify="between">
            {showCharacterCount && (
              <Typography className={chatInputStyles.element6} variant="caption">
                {value.length}/{maxLength}
              </Typography>
            )}
            {showClearButton && (
              <FlexRow gap="xs">
                <Button
                  className={chatInputStyles.element7}
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

export type { ChatInputProps } from "./types";
