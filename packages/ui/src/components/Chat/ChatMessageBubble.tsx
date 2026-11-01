"use client";

import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { Flex, FlexRow } from "../Flex";
import { Typography } from "../Typography";

export interface ChatMessageBubbleProps {
  className?: string;
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
      status?: "online" | "offline" | "away" | "busy";
    };
    timestamp: Date;
    isOwn?: boolean;
    type?: "text" | "image" | "file" | "system";
    status?: "sending" | "sent" | "delivered" | "read" | "failed";
  };
  showAvatar?: boolean;
  showStatus?: boolean;
  showTimestamp?: boolean;
}

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
      className={cn("group mb-4", message.isOwn ? "justify-end" : "justify-start", className)}
    >
      <Flex
        className={cn(
          "max-w-[70%] rounded-lg transition-all duration-300 shadow-lg backdrop-blur-md relative overflow-hidden border-2 flex flex-col",
          message.isOwn
            ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/30 border-blue-400"
            : "bg-white text-gray-800 shadow-md border-gray-200",
        )}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        {/* Message Header */}
        <FlexRow
          align="center"
          className="px-4 py-2 border-b border-white/10 relative z-10"
          justify="between"
        >
          <FlexRow align="center" gap="sm">
            {!message.isOwn && showAvatar && (
              <Avatar className="ring-2 ring-white/30 shadow-md">
                {message.sender.avatar ? <AvatarImage alt="" src={message.sender.avatar} /> : null}
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <FlexRow align="center" gap="xs">
              <Typography className="font-semibold text-gray-800" variant="caption">
                {message.sender.name}
              </Typography>
              <Typography className="text-gray-500 text-xs" variant="caption">
                {message.sender.status}
              </Typography>
            </FlexRow>
          </FlexRow>
          <Typography className="opacity-70 text-sm font-medium" variant="caption">
            {formatTime(message.timestamp)}
          </Typography>
        </FlexRow>

        {/* Message Content */}
        <div className="px-4 py-3 flex-1 relative z-10">
          <Typography className="whitespace-pre-wrap leading-relaxed" variant="body1">
            {message.content}
          </Typography>
        </div>

        {/* Message Footer */}
        {showTimestamp && (
          <FlexRow
            align="center"
            className="px-4 py-2 border-t border-white/10 relative z-10"
            justify="between"
          >
            <div></div>
            {message.isOwn && showStatus && message.status && (
              <FlexRow align="center" gap="xs">
                <Typography className="opacity-80 text-sm" variant="caption">
                  {getStatusIcon(message.status)}
                </Typography>
                <Typography className="opacity-60 text-xs font-medium" variant="caption">
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
