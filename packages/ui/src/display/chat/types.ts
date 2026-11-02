import type * as React from "react";
import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import type { chatVariants } from "./styles";

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

export interface ChatInputProps {
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onClear?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  placeholder?: string;
  showCharacterCount?: boolean;
  showClearButton?: boolean;
  value: string;
}

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

export interface ChatTypingIndicatorProps {
  className?: string;
  isVisible?: boolean;
  users: string[];
}

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

export type ChatComposerOptions = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  placeholder?: string;
};

export type StudioChatScreenOptions = {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onStop: () => void;
  busy: boolean;
  disabled: boolean;
  messages: { id: number; role: "user" | "assistant"; text: string }[];
  review?: ReactNode;
  notice?: ReactNode;
  error?: string;
  status?: string;
  actions?: ReactNode;
  editorHref: string;
};
