"use client";

import { cn } from "cn";

import { Flex, FlexRow } from "../../layout/flex";
import { Typography } from "../typography";

export interface ChatTypingIndicatorProps {
  className?: string;
  isVisible?: boolean;
  users: string[];
}

export function ChatTypingIndicator({
  users,
  isVisible = true,
  className,
}: ChatTypingIndicatorProps) {
  if (!isVisible || users.length === 0) return null;

  return (
    <Flex className={cn("justify-start mb-6", className)} fullWidth>
      <Flex
        className="max-w-[70%] rounded-[var(--radius-lg)] px-[var(--spacing-md)] py-[var(--spacing-md)] bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-md)] border border-[var(--border)]/50 relative overflow-hidden"
        fullWidth
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-50" />
        <FlexRow align="center" className="relative z-10" gap="sm">
          <FlexRow gap="xs">
            <Flex
              className="bg-[var(--primary)] animate-bounce"
              height="xs"
              radius="full"
              width="xs"
            />
            <Flex
              className="bg-[var(--primary)] animate-bounce"
              height="xs"
              radius="full"
              style={{ animationDelay: "0.1s" }}
              width="xs"
            />
            <Flex
              className="bg-[var(--primary)] animate-bounce"
              height="xs"
              radius="full"
              style={{ animationDelay: "0.2s" }}
              width="xs"
            />
          </FlexRow>
          <Typography className="text-[var(--muted-foreground)] font-medium" variant="body2">
            {users.length === 1
              ? `${users[0]} is typing...`
              : `${users.length} people are typing...`}
          </Typography>
        </FlexRow>
      </Flex>
    </Flex>
  );
}
