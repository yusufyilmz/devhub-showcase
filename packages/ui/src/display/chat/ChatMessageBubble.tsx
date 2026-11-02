"use client";

import { cn } from "cn";

import { Flex, FlexRow } from "../../layout/flex";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Typography } from "../typography";
import { chatMessageBubbleStyles } from "./styles";
import type { ChatMessageBubbleProps } from "./types";

export function ChatMessageBubble({
  message,
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  className,
}: ChatMessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return "⏳";
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      case "failed":
        return "❌";
      default:
        return "";
    }
  };

  return (
    <FlexRow
      className={cn(
        chatMessageBubbleStyles.chatMessageBubble,
        message.isOwn
          ? chatMessageBubbleStyles.chatMessageBubble2
          : chatMessageBubbleStyles.chatMessageBubble3,
        className,
      )}
    >
      <Flex
        className={cn(
          chatMessageBubbleStyles.chatMessageBubble4,
          message.isOwn
            ? chatMessageBubbleStyles.chatMessageBubble5
            : chatMessageBubbleStyles.chatMessageBubble6,
        )}
      >
        {/* Subtle background pattern */}
        <div className={chatMessageBubbleStyles.element1}>
          <div className={chatMessageBubbleStyles.element2} />
        </div>

        {/* Message Header */}
        <FlexRow align="center" className={chatMessageBubbleStyles.element3} justify="between">
          <FlexRow align="center" gap="sm">
            {!message.isOwn && showAvatar && (
              <Avatar className={chatMessageBubbleStyles.element4}>
                {message.sender.avatar ? <AvatarImage alt="" src={message.sender.avatar} /> : null}
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <FlexRow align="center" gap="xs">
              <Typography className={chatMessageBubbleStyles.element5} variant="caption">
                {message.sender.name}
              </Typography>
              <Typography className={chatMessageBubbleStyles.element6} variant="caption">
                {message.sender.status}
              </Typography>
            </FlexRow>
          </FlexRow>
          <Typography className={chatMessageBubbleStyles.element7} variant="caption">
            {formatTime(message.timestamp)}
          </Typography>
        </FlexRow>

        {/* Message Content */}
        <div className={chatMessageBubbleStyles.element8}>
          <Typography className={chatMessageBubbleStyles.element9} variant="body1">
            {message.content}
          </Typography>
        </div>

        {/* Message Footer */}
        {showTimestamp && (
          <FlexRow align="center" className={chatMessageBubbleStyles.element10} justify="between">
            <div></div>
            {message.isOwn && showStatus && message.status && (
              <FlexRow align="center" gap="xs">
                <Typography className={chatMessageBubbleStyles.element11} variant="caption">
                  {getStatusIcon(message.status)}
                </Typography>
                <Typography className={chatMessageBubbleStyles.element12} variant="caption">
                  {message.status}
                </Typography>
              </FlexRow>
            )}
          </FlexRow>
        )}
      </Flex>
    </FlexRow>
  );
}

export type { ChatMessageBubbleProps } from "./types";
