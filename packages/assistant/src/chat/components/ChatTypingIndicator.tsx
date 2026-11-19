"use client";

import { cn } from "cn";

import { Flex, FlexRow } from "@shared/ui/flex";
import { Typography } from "@shared/ui/typography";

import {
  chatTypingIndicatorInlineStyle1,
  chatTypingIndicatorInlineStyle2,
  chatTypingIndicatorStyles,
} from "./styles";
import type { ChatTypingIndicatorProps } from "./types";

export function ChatTypingIndicator({
  users,
  isVisible = true,
  className,
}: ChatTypingIndicatorProps) {
  if (!isVisible || users.length === 0) return null;

  return (
    <Flex className={cn(chatTypingIndicatorStyles.chatTypingIndicator, className)} fullWidth>
      <Flex className={chatTypingIndicatorStyles.element1} fullWidth>
        {/* Subtle background pattern */}
        <div className={chatTypingIndicatorStyles.element2} />
        <FlexRow align="center" className={chatTypingIndicatorStyles.element3} gap="sm">
          <FlexRow gap="xs">
            <Flex
              className={chatTypingIndicatorStyles.element4}
              height="xs"
              radius="full"
              width="xs"
            />
            <Flex
              className={chatTypingIndicatorStyles.element5}
              height="xs"
              radius="full"
              style={chatTypingIndicatorInlineStyle1}
              width="xs"
            />
            <Flex
              className={chatTypingIndicatorStyles.element6}
              height="xs"
              radius="full"
              style={chatTypingIndicatorInlineStyle2}
              width="xs"
            />
          </FlexRow>
          <Typography className={chatTypingIndicatorStyles.element7} variant="body2">
            {users.length === 1
              ? `${users[0]} is typing...`
              : `${users.length} people are typing...`}
          </Typography>
        </FlexRow>
      </Flex>
    </Flex>
  );
}

export type { ChatTypingIndicatorProps } from "./types";
