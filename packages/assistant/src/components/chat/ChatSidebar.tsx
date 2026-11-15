"use client";

import { cn } from "cn";

import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Flex, FlexCenter, FlexCol, FlexRow } from "@shared/ui/flex";
import { Input } from "@shared/ui/input";
import { Typography } from "@shared/ui/typography";

import { chatSidebarStyles } from "./styles";
import type { ChatSidebarProps, ChatSidebarSection } from "./types";

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
    <Flex className={cn(chatSidebarStyles.chatSidebar, className)} direction="column">
      {/* Header */}
      <FlexCol className={chatSidebarStyles.element1} gap="sm" padding="md">
        <FlexRow align="center" gap="sm">
          <FlexCenter
            background="primary"
            className={chatSidebarStyles.element2}
            height="sm"
            radius="lg"
            shadow="md"
            width="sm"
          >
            <Typography className={chatSidebarStyles.element3} variant="body2">
              💬
            </Typography>
          </FlexCenter>
          <Typography className={chatSidebarStyles.element4} variant="h4">
            {title}
          </Typography>
        </FlexRow>

        {subtitle && (
          <Typography className={chatSidebarStyles.element5} variant="body2">
            {subtitle}
          </Typography>
        )}
      </FlexCol>

      {/* Search */}
      <Flex className={chatSidebarStyles.element6} padding="md">
        <Input
          className={chatSidebarStyles.element7}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
      </Flex>

      {/* New Chat Button */}
      <Flex className={chatSidebarStyles.element8} padding="md">
        <Button className={chatSidebarStyles.element9} onClick={onNewChat} variant="outline">
          <FlexCenter
            background="primary"
            className={chatSidebarStyles.element10}
            height="md"
            radius="lg"
            shadow="md"
            width="md"
          >
            <Typography className={chatSidebarStyles.element11} variant="body1">
              +
            </Typography>
          </FlexCenter>
          <Typography className={chatSidebarStyles.element12} variant="body1">
            New conversation
          </Typography>
        </Button>
      </Flex>

      {/* Chat List */}
      <FlexCol className={chatSidebarStyles.element13}>
        {sections.map((section, sectionIndex) => (
          <FlexCol className={chatSidebarStyles.element14} key={sectionIndex}>
            {section.title && (
              <Flex className={chatSidebarStyles.element15} padding="sm">
                <Typography className={chatSidebarStyles.element16} variant="caption">
                  {section.title}
                </Typography>
              </Flex>
            )}

            <FlexCol>
              {section.items.map((item) => (
                <Button
                  className={cn(
                    chatSidebarStyles.chatSidebar2,
                    item.isActive ? chatSidebarStyles.chatSidebar3 : chatSidebarStyles.chatSidebar4,
                  )}
                  key={item.id}
                  onClick={item.onClick}
                  variant="ghost"
                >
                  <FlexCol className={chatSidebarStyles.element17}>
                    <FlexRow
                      align="center"
                      className={chatSidebarStyles.element18}
                      justify="between"
                    >
                      <Typography className={chatSidebarStyles.element19} variant="body2">
                        {item.title}
                      </Typography>
                      {item.unreadCount && item.unreadCount > 0 && (
                        <Badge variant="destructive">{item.unreadCount}</Badge>
                      )}
                    </FlexRow>
                    {item.subtitle && (
                      <Typography className={chatSidebarStyles.element20} variant="caption">
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
      <Flex className={chatSidebarStyles.element21} padding="md">
        <FlexRow align="center" className={chatSidebarStyles.element22} justify="between">
          <FlexRow align="center" gap="sm">
            <Avatar>
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <Typography className={chatSidebarStyles.element23} variant="caption">
              You
            </Typography>
          </FlexRow>

          {onSettings && (
            <Button
              className={chatSidebarStyles.element24}
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

export type { ChatSidebarItem, ChatSidebarProps, ChatSidebarSection } from "./types";
