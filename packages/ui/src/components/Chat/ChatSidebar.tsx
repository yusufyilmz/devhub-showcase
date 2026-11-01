"use client";

import { cn } from "cn";

import { Avatar, AvatarFallback } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Flex, FlexCenter, FlexCol, FlexRow } from "../Flex";
import { Input } from "../Input";
import { Typography } from "../Typography";

export interface ChatSidebarProps {
  className?: string;
  onNewChat?: () => void;
  onSearchChange?: (value: string) => void;
  onSettings?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  subtitle?: string;
  title?: string;
}

export interface ChatSidebarItem {
  avatar?: string;
  id: string;
  isActive?: boolean;
  onClick?: () => void;
  subtitle?: string;
  title: string;
  unreadCount?: number;
}

export interface ChatSidebarSection {
  items: ChatSidebarItem[];
  title?: string;
}

export function ChatSidebar({
  title = "Chats",
  subtitle,
  searchPlaceholder = "Search chats...",
  searchValue = "",
  onSearchChange,
  onNewChat,
  onSettings,
  className,
}: ChatSidebarProps) {
  // This would typically come from props or context
  const sections: ChatSidebarSection[] = [
    {
      items: [
        {
          id: "1",
          isActive: true,
          subtitle: "Last message from Alice",
          title: "General Discussion",
          unreadCount: 3,
        },
        {
          id: "2",
          subtitle: "Last message from Bob",
          title: "Development Team",
          unreadCount: 0,
        },
        {
          id: "3",
          subtitle: "Last message from Carol",
          title: "Design Review",
          unreadCount: 1,
        },
      ],
      title: "Recent",
    },
    {
      items: [
        {
          id: "4",
          subtitle: "Last message from Dave",
          title: "Old Project Chat",
          unreadCount: 0,
        },
      ],
      title: "Archived",
    },
  ];

  return (
    <Flex
      className={cn(
        "w-80 border-r border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-2xl overflow-hidden",
        className,
      )}
      direction="column"
    >
      {/* Header */}
      <FlexCol className="border-b border-[var(--border)]" gap="sm" padding="md">
        <FlexRow align="center" gap="sm">
          <FlexCenter
            background="primary"
            className="bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/80 shadow-[var(--primary)]/30"
            height="sm"
            radius="lg"
            shadow="md"
            width="sm"
          >
            <Typography className="text-sm font-bold text-white" variant="body2">
              💬
            </Typography>
          </FlexCenter>
          <Typography className="font-bold text-[var(--foreground)]" variant="h4">
            {title}
          </Typography>
        </FlexRow>

        {subtitle && (
          <Typography className="text-[var(--muted-foreground)] leading-relaxed" variant="body2">
            {subtitle}
          </Typography>
        )}
      </FlexCol>

      {/* Search */}
      <Flex className="border-b border-[var(--border)]" padding="md">
        <Input
          className="w-full bg-[var(--background)]/80 border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
      </Flex>

      {/* New Chat Button */}
      <Flex className="border-b border-[var(--border)]" padding="md">
        <Button
          className="w-full justify-start gap-4 rounded-2xl hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-[var(--accent)]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border-2 border-[var(--border)] hover:border-[var(--primary)]/30"
          onClick={onNewChat}
          variant="outline"
        >
          <FlexCenter
            background="primary"
            className="bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/80 shadow-[var(--primary)]/30"
            height="md"
            radius="lg"
            shadow="md"
            width="md"
          >
            <Typography className="text-lg font-bold text-white" variant="body1">
              +
            </Typography>
          </FlexCenter>
          <Typography className="font-semibold" variant="body1">
            New conversation
          </Typography>
        </Button>
      </Flex>

      {/* Chat List */}
      <FlexCol className="flex-1 overflow-y-auto">
        {sections.map((section, sectionIndex) => (
          <FlexCol className="border-b border-[var(--border)] last:border-b-0" key={sectionIndex}>
            {section.title && (
              <Flex className="bg-[var(--muted)]/30" padding="sm">
                <Typography
                  className="font-semibold text-[var(--muted-foreground)] uppercase tracking-wide"
                  variant="caption"
                >
                  {section.title}
                </Typography>
              </Flex>
            )}

            <FlexCol>
              {section.items.map((item) => (
                <Button
                  className={cn(
                    "w-full justify-start gap-4 rounded-none border-0 p-4 text-left transition-all duration-200",
                    item.isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] border-r-2 border-[var(--primary)]"
                      : "hover:bg-[var(--muted)]/50 text-[var(--foreground)]",
                  )}
                  key={item.id}
                  onClick={item.onClick}
                  variant="ghost"
                >
                  <FlexCol className="min-w-0 flex-1">
                    <FlexRow align="center" className="mb-1" justify="between">
                      <Typography className="font-semibold truncate" variant="body2">
                        {item.title}
                      </Typography>
                      {item.unreadCount && item.unreadCount > 0 && (
                        <Badge variant="destructive">{item.unreadCount}</Badge>
                      )}
                    </FlexRow>
                    {item.subtitle && (
                      <Typography
                        className="text-[var(--muted-foreground)] truncate"
                        variant="caption"
                      >
                        {item.subtitle}
                      </Typography>
                    )}
                  </FlexCol>
                </Button>
              ))}
            </FlexCol>
          </FlexCol>
        ))}
      </FlexCol>

      {/* Footer */}
      <Flex className="border-t border-[var(--border)]" padding="md">
        <FlexRow align="center" className="w-full" justify="between">
          <FlexRow align="center" gap="sm">
            <Avatar>
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <Typography className="text-[var(--muted-foreground)]" variant="caption">
              You
            </Typography>
          </FlexRow>

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
      </Flex>
    </Flex>
  );
}
