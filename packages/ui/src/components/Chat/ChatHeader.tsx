"use client";

import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { FlexCol, FlexRow } from "../Flex";
import { Typography } from "../Typography";

export interface ChatHeaderProps {
  avatar?: string;
  className?: string;
  fullWidth?: boolean;
  messageCount?: number;
  onInfo?: () => void;
  onSettings?: () => void;
  status?: "online" | "offline" | "away" | "busy";
  subtitle?: string;
  title?: string;
}

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
        "w-full p-[var(--spacing-lg)] bg-gradient-to-r from-[var(--background)] to-[var(--card)] backdrop-blur-xl shadow-[var(--shadow-sm)] relative overflow-hidden",
        fullWidth && "w-full",
        className,
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-50" />
      <FlexRow align="center" className="w-full relative z-10" gap="md">
        <Avatar className="ring-2 ring-[var(--primary)]/20 shadow-[var(--shadow-md)]">
          {avatar ? <AvatarImage alt="" src={avatar} /> : null}
          <AvatarFallback>💬</AvatarFallback>
        </Avatar>

        <FlexCol className="flex-1">
          <Typography className="text-[var(--foreground)] font-bold" variant="h6">
            {title}
          </Typography>
          {subtitle && (
            <Typography className="text-[var(--muted-foreground)] text-sm" variant="caption">
              {subtitle}
            </Typography>
          )}
          {messageCount !== undefined && (
            <Typography className="text-[var(--muted-foreground)] text-xs" variant="caption">
              {messageCount} messages
            </Typography>
          )}
        </FlexCol>

        <FlexRow gap="sm">
          <Badge variant={status === "online" ? "default" : "outline"}>{status}</Badge>

          {onInfo && (
            <Button
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={onInfo}
              size="sm"
              variant="ghost"
            >
              <Typography variant="body2">ℹ️</Typography>
            </Button>
          )}

          {onSettings && (
            <Button
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
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
