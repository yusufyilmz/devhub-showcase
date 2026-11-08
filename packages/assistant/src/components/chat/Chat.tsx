"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "cn";

import { Flex, FlexCenter, FlexCol } from "@shared/ui/flex";
import { Typography } from "@shared/ui/typography";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { chatStyles, chatVariants } from "./styles";
import type { ChatProps } from "./types";

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
        chatStyles.chat,
        fullWidth && chatStyles.chat2,
        fullHeight && chatStyles.chat3,
        className,
      )}
      {...props}
    >
      {/* Chat component with improved layout */}
      {/* Chat Header */}
      <ChatHeader
        className={chatStyles.element1}
        fullWidth
        messageCount={messages.length}
        status="online"
        subtitle={`${messages.length} messages`}
        title="Chat Room"
      />

      {/* Messages Area */}
      <div className={chatStyles.element2}>
        <FlexCol className={chatStyles.element3} gap="sm">
          {messages.length === 0 ? (
            <FlexCenter className={chatStyles.element4}>
              <FlexCol align="center" gap="md">
                <Flex className={chatStyles.element5} height="xl" radius="full" width="xl">
                  <Typography className={chatStyles.element6} variant="h4">
                    💬
                  </Typography>
                </Flex>
                <FlexCol align="center" gap="sm">
                  <Typography className={chatStyles.element7} variant="h6">
                    No messages yet
                  </Typography>
                  <Typography className={chatStyles.element8} variant="body2">
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
        className={chatStyles.element9}
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

export type { ChatMessage, ChatProps } from "./types";
