"use client";

import { cn } from "cn";

import { Button } from "../../buttons/button";
import { Badge } from "../../feedback/badge";
import { FlexCol, FlexRow } from "../../layout/flex";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Typography } from "../typography";
import { chatHeaderStyles } from "./styles";
import type { ChatHeaderProps } from "./types";

export function ChatHeader({
  title = "Chat Room",
  subtitle,
  avatar,
  status = "online",
  messageCount,
  onSettings,
  onInfo,
  fullWidth,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        chatHeaderStyles.chatHeader,
        fullWidth && chatHeaderStyles.chatHeader2,
        className,
      )}
    >
      {/* Subtle background pattern */}
      <div className={chatHeaderStyles.element1} />
      <FlexRow align="center" className={chatHeaderStyles.element2} gap="md">
        <Avatar className={chatHeaderStyles.element3}>
          {avatar ? <AvatarImage alt="" src={avatar} /> : null}
          <AvatarFallback>💬</AvatarFallback>
        </Avatar>

        <FlexCol className={chatHeaderStyles.element4}>
          <Typography className={chatHeaderStyles.element5} variant="h6">
            {title}
          </Typography>
          {subtitle && (
            <Typography className={chatHeaderStyles.element6} variant="caption">
              {subtitle}
            </Typography>
          )}
          {messageCount !== undefined && (
            <Typography className={chatHeaderStyles.element7} variant="caption">
              {messageCount} messages
            </Typography>
          )}
        </FlexCol>

        <FlexRow gap="sm">
          <Badge variant={status === "online" ? "default" : "outline"}>{status}</Badge>

          {onInfo && (
            <Button
              className={chatHeaderStyles.element8}
              onClick={onInfo}
              size="sm"
              variant="ghost"
            >
              <Typography variant="body2">ℹ️</Typography>
            </Button>
          )}

          {onSettings && (
            <Button
              className={chatHeaderStyles.element9}
              onClick={onSettings}
              size="sm"
              variant="ghost"
            >
              <Typography variant="body2">⚙️</Typography>
            </Button>
          )}
        </FlexRow>
      </FlexRow>
    </div>
  );
}

export type { ChatHeaderProps } from "./types";
