"use client";

import { useEffect, useRef, useState } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Flex, FlexCenter, FlexCol } from "../../layout/flex";
import { Typography } from "../typography";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatTypingIndicator } from "./ChatTypingIndicator";

const chatVariants = cva("relative overflow-hidden backdrop-blur-xl", {
  defaultVariants: {
    shadow: "md",
    size: "md",
    variant: "default",
  },
  variants: {
    shadow: {
      lg: "shadow-[var(--shadow-2xl)]",
      md: "shadow-[var(--shadow-xl)]",
      none: "shadow-none",
      sm: "shadow-[var(--shadow-md)]",
      xl: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
    },
    size: {
      lg: "rounded-[var(--radius-2xl)]",
      md: "rounded-[var(--radius-xl)]",
      sm: "rounded-[var(--radius-lg)]",
    },
    variant: {
      card: "bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 border border-[var(--border)] shadow-[var(--shadow-2xl)]",
      default:
        "bg-gradient-to-br from-[var(--background)] to-[var(--card)] border border-[var(--border)] shadow-[var(--shadow-xl)]",
      ghost: "bg-transparent",
    },
  },
});

export interface ChatProps extends React.ComponentProps<"div">, VariantProps<typeof chatVariants> {
  fullHeight?: boolean;
  fullWidth?: boolean;
}

export interface ChatMessage {
  content: string;
  id: string;
  isOwn?: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "offline" | "away" | "busy";
  };
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  timestamp: Date;
  type?: "text" | "image" | "file" | "system";
}

export interface ChatProps extends React.ComponentProps<"div">, VariantProps<typeof chatVariants> {
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  fullHeight?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  messages: ChatMessage[];
  onSendMessage?: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  showTypingIndicator?: boolean;
  typingUsers?: string[];
}

export function Chat({
  className,
  variant,
  size,
  shadow,
  messages,
  onSendMessage,
  onTyping,
  placeholder = "Type a message...",
  maxLength = 1000,
  showTypingIndicator = true,
  typingUsers = [],
  currentUser,
  fullWidth,
  fullHeight,
  ...props
}: ChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to scroll to the bottom of the messages when the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      setIsTyping(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (onTyping) {
      if (value.trim() && !isTyping) {
        setIsTyping(true);
        onTyping(true);
      } else if (!value.trim() && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }
  };

  return (
    <div
      className={cn(
        chatVariants({ shadow, size, variant }),
        "flex flex-col h-full w-full",
        fullWidth && "w-full",
        fullHeight && "h-full",
        className,
      )}
      {...props}
    >
      {/* Chat component with improved layout */}
      {/* Chat Header */}
      <ChatHeader
        className="border-b border-[var(--border)]"
        fullWidth
        messageCount={messages.length}
        status="online"
        subtitle={`${messages.length} messages`}
        title="Chat Room"
      />

      {/* Messages Area */}
      <div className="flex-1 p-[var(--spacing-lg)] overflow-y-auto bg-gradient-to-b from-[var(--muted)]/20 to-[var(--background)]">
        <FlexCol className="min-h-0" gap="sm">
          {messages.length === 0 ? (
            <FlexCenter className="h-48">
              <FlexCol align="center" gap="md">
                <Flex
                  className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/20 shadow-[var(--shadow-md)]"
                  height="xl"
                  radius="full"
                  width="xl"
                >
                  <Typography className="text-[var(--primary)]" variant="h4">
                    💬
                  </Typography>
                </Flex>
                <FlexCol align="center" gap="sm">
                  <Typography className="text-[var(--foreground)] font-bold" variant="h6">
                    No messages yet
                  </Typography>
                  <Typography
                    className="text-[var(--muted-foreground)] text-center"
                    variant="body2"
                  >
                    Start the conversation and connect with your team!
                  </Typography>
                </FlexCol>
              </FlexCol>
            </FlexCenter>
          ) : (
            messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                showAvatar={!message.isOwn}
                showStatus={message.isOwn}
                showTimestamp={true}
              />
            ))
          )}

          {/* Typing Indicator */}
          <ChatTypingIndicator
            isVisible={showTypingIndicator && typingUsers.length > 0}
            users={typingUsers}
          />

          <div ref={messagesEndRef} />
        </FlexCol>
      </div>

      {/* Message Input */}
      <ChatInput
        className="border-t border-[var(--border)]"
        fullWidth
        maxLength={maxLength}
        onChange={handleInputChange}
        onClear={() => setInputValue("")}
        onSend={handleSend}
        placeholder={placeholder}
        showCharacterCount={true}
        showClearButton={true}
        value={inputValue}
      />
    </div>
  );
}
