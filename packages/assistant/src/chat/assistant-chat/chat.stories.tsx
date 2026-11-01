import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image as ImageIcon, Mic, Paperclip, Smile } from "lucide-react";

import {
  ChatAvatar,
  ChatAvatarGroup,
  ChatBubble,
  ChatBubbleGroup,
  ChatBubbleReactions,
  ChatBubbleTimestamp,
  ChatInput,
  ChatInputAction,
  ChatList,
  ChatListEmpty,
  ChatListItem,
  ChatListSeparator,
  ChatMessageActions,
  ChatQuickReactions,
  ChatTyping,
  ChatTypingText,
} from "./index";

/**
 * Enhanced Chat Example
 * Complete chat interface using enhanced components
 */

interface Message {
  content: string;
  id: string;
  reactions?: Array<{ emoji: string; count: number; active?: boolean }>;
  timestamp: string;
  variant: "sent" | "received";
}

export function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hey! How are you doing?",
      id: "1",
      reactions: [{ active: false, count: 2, emoji: "👍" }],
      timestamp: "10:30 AM",
      variant: "received",
    },
    {
      content: "I'm great! Just working on some new features.",
      id: "2",
      timestamp: "10:32 AM",
      variant: "sent",
    },
    {
      content: "That sounds exciting! What kind of features?",
      id: "3",
      timestamp: "10:33 AM",
      variant: "received",
    },
    {
      content: "Enhanced chat components with amazing visual effects! Check this out 🚀",
      id: "4",
      reactions: [
        { active: true, count: 3, emoji: "🔥" },
        { active: false, count: 1, emoji: "🎉" },
      ],
      timestamp: "10:35 AM",
      variant: "sent",
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = (value: string) => {
    const newMessage: Message = {
      content: value,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      variant: "sent",
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            return {
              ...msg,
              reactions: reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        active: !r.active,
                        count: r.active ? r.count - 1 : r.count + 1,
                      }
                    : r,
                )
                .filter((r) => r.count > 0),
            };
          }
          return {
            ...msg,
            reactions: [...reactions, { active: true, count: 1, emoji }],
          };
        }
        return msg;
      }),
    );
  };

  return (
    <div className="flex h-[600px] flex-col border rounded-xl overflow-hidden bg-background">
      {/* Chat List */}
      <ChatList className="flex-1" glassEffect={false} showBottomFade showTopFade>
        {messages.length === 0 ? (
          <ChatListEmpty description="Start a conversation!" icon="💬" title="No messages yet" />
        ) : (
          <>
            <ChatListSeparator label="Today" />

            {messages.map((message) => (
              <ChatListItem isOwn={message.variant === "sent"} key={message.id}>
                <ChatBubbleGroup align={message.variant === "sent" ? "right" : "left"}>
                  <ChatBubble
                    enableGlow={message.variant === "sent"}
                    enableHover
                    maxWidth="80%"
                    variant={message.variant}
                  >
                    {message.content}
                  </ChatBubble>

                  <ChatBubbleTimestamp showIcon time={message.timestamp} />

                  {message.reactions && message.reactions.length > 0 && (
                    <ChatBubbleReactions
                      onReactionClick={(emoji) => handleReaction(message.id, emoji)}
                      reactions={message.reactions}
                    />
                  )}
                </ChatBubbleGroup>
              </ChatListItem>
            ))}
          </>
        )}
      </ChatList>

      {/* Chat Input */}
      <ChatInput
        glassInput={false}
        leftActions={
          <>
            <ChatInputAction icon={<Paperclip className="h-4 w-4" />} label="Attach file" />
            <ChatInputAction icon={<ImageIcon className="h-4 w-4" />} label="Send image" />
          </>
        }
        maxLength={500}
        onSubmit={handleSend}
        onValueChange={setInputValue}
        placeholder="Type your message..."
        rightActions={
          <>
            <ChatInputAction icon={<Smile className="h-4 w-4" />} label="Add emoji" />
            <ChatInputAction
              colorScheme="info"
              icon={<Mic className="h-4 w-4" />}
              label="Voice message"
            />
          </>
        }
        sendButtonColor="primary"
        showCharacterCount
        value={inputValue}
        variant="default"
      />
    </div>
  );
}

const meta = {
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Components/Chat",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic sent, received, and system messages.
 */
export const Simple: Story = {
  render: function SimpleChat() {
    const [message, setMessage] = useState("");

    return (
      <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border">
        <ChatList className="flex-1">
          <ChatListSeparator label="Today" />
          <ChatListItem isOwn={false}>
            <div className="flex items-start gap-2">
              <ChatAvatar fallback="JD" online={true} size="sm" />
              <ChatBubbleGroup align="left">
                <ChatBubble variant="received">Hey! How are you doing?</ChatBubble>
                <ChatBubbleTimestamp time="2:30 PM" />
              </ChatBubbleGroup>
            </div>
          </ChatListItem>
          <ChatListItem isOwn={true}>
            <ChatBubbleGroup align="right">
              <ChatBubble variant="sent">I'm great! Just working on the new UI.</ChatBubble>
              <ChatBubbleTimestamp time="2:31 PM" />
            </ChatBubbleGroup>
          </ChatListItem>
          <ChatListItem>
            <ChatBubble variant="system">John joined the chat</ChatBubble>
          </ChatListItem>
        </ChatList>
        <ChatInput
          onSubmit={() => setMessage("")}
          onValueChange={setMessage}
          placeholder="Type a message..."
          value={message}
        />
      </div>
    );
  },
};

/**
 * Reactions, hover actions, and a typing indicator.
 */
export const Advanced: Story = {
  render: function AdvancedChat() {
    const [message, setMessage] = useState("");
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
      <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border">
        <ChatList
          className="flex-1"
          onLoadMore={() => undefined}
          showLoadMore={true}
          showScrollButton={true}
        >
          <ChatListSeparator label="Yesterday" />
          <ChatListItem
            isOwn={false}
            onMouseEnter={() => setHoveredId("msg-1")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-start gap-2">
              <ChatAvatar
                fallback="A"
                size="sm"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
              />
              <div className="relative flex-1">
                <ChatBubbleGroup align="left">
                  <ChatBubble maxWidth="400px" variant="received">
                    Check out this new feature! What do you think? 🚀
                  </ChatBubble>
                  <ChatBubbleTimestamp time="9:15 AM" />
                  <ChatBubbleReactions
                    onReactionClick={() => undefined}
                    reactions={[
                      { active: true, count: 3, emoji: "👍" },
                      { count: 2, emoji: "🔥" },
                      { count: 1, emoji: "❤️" },
                    ]}
                  />
                </ChatBubbleGroup>
                <ChatMessageActions
                  actions={[
                    {
                      icon: <span>👍</span>,
                      label: "React",
                      onClick: () => undefined,
                    },
                    {
                      icon: <span>↪</span>,
                      label: "Reply",
                      onClick: () => undefined,
                    },
                    {
                      icon: <span>➤</span>,
                      label: "Forward",
                      onClick: () => undefined,
                    },
                  ]}
                  align="right"
                  position="top"
                  visible={hoveredId === "msg-1"}
                />
              </div>
            </div>
          </ChatListItem>
          <ChatListSeparator label="Today" />
          <ChatListItem
            isOwn={true}
            onMouseEnter={() => setHoveredId("msg-2")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative">
              <ChatBubbleGroup align="right">
                <ChatBubble maxWidth="400px" variant="sent">
                  Absolutely love it! This is exactly what we needed. Great work! 🎉
                </ChatBubble>
                <ChatBubbleTimestamp time="10:45 AM" />
              </ChatBubbleGroup>
              <ChatMessageActions
                actions={[
                  {
                    icon: <span>✎</span>,
                    label: "Edit",
                    onClick: () => undefined,
                  },
                  {
                    icon: <span>🗑</span>,
                    label: "Delete",
                    onClick: () => undefined,
                    variant: "destructive",
                  },
                ]}
                align="left"
                position="top"
                visible={hoveredId === "msg-2"}
              />
            </div>
          </ChatListItem>
          <ChatListItem isOwn={false}>
            <div className="flex items-start gap-2">
              <ChatAvatar fallback="A" size="sm" typing={true} />
              <ChatTyping showBubble={true} size="md" />
            </div>
          </ChatListItem>
        </ChatList>
        <ChatInput
          leftActions={
            <>
              <ChatInputAction
                icon={<span>📎</span>}
                label="Attach file"
                onClick={() => undefined}
              />
              <ChatInputAction icon={<span>😊</span>} label="Add emoji" onClick={() => undefined} />
              <ChatInputAction icon={<span>@</span>} label="Mention" onClick={() => undefined} />
            </>
          }
          maxLength={5000}
          onSubmit={() => setMessage("")}
          onValueChange={setMessage}
          placeholder="Type a message..."
          showCharacterCount={true}
          value={message}
        />
      </div>
    );
  },
};

/**
 * Several participants, an avatar group, and a typing line.
 */
export const Group: Story = {
  render: function GroupChat() {
    const users = [
      {
        fallback: "A",
        src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      {
        fallback: "B",
        src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
      {
        fallback: "C",
        src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
    ];

    return (
      <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border">
        <div className="flex items-center gap-3 border-b p-4">
          <ChatAvatarGroup avatars={users} max={3} size="sm" />
          <div>
            <h3 className="font-semibold">Team Chat</h3>
            <p className="text-sm text-muted-foreground">3 members</p>
          </div>
        </div>
        <ChatList className="flex-1">
          <ChatListItem isOwn={false}>
            <div className="flex items-start gap-2">
              <ChatAvatar fallback="A" online={true} size="sm" />
              <div>
                <span className="mb-1 block text-xs font-semibold">Alice</span>
                <ChatBubbleGroup align="left">
                  <ChatBubble variant="received">Morning team! 👋</ChatBubble>
                  <ChatBubbleTimestamp time="9:00 AM" />
                </ChatBubbleGroup>
              </div>
            </div>
          </ChatListItem>
          <ChatListItem isOwn={false}>
            <div className="flex items-start gap-2">
              <ChatAvatar fallback="B" online={true} size="sm" />
              <div>
                <span className="mb-1 block text-xs font-semibold">Bob</span>
                <ChatBubbleGroup align="left">
                  <ChatBubble variant="received">Hey! Ready for the standup?</ChatBubble>
                  <ChatBubbleTimestamp time="9:01 AM" />
                </ChatBubbleGroup>
              </div>
            </div>
          </ChatListItem>
          <ChatListItem isOwn={true}>
            <ChatBubbleGroup align="right">
              <ChatBubble variant="sent">Yes! Let's do this 💪</ChatBubble>
              <ChatBubbleTimestamp time="9:02 AM" />
            </ChatBubbleGroup>
          </ChatListItem>
          <ChatListItem>
            <ChatTypingText size="sm" users={["Charlie"]} />
          </ChatListItem>
        </ChatList>
        <ChatInput
          onSubmit={() => undefined}
          onValueChange={() => undefined}
          placeholder="Message #team-chat..."
          value=""
        />
      </div>
    );
  },
};

/**
 * The empty list state before the first message.
 */
export const Empty: Story = {
  render: () => (
    <div className="h-[600px] overflow-hidden rounded-lg border">
      <ChatList className="h-full">
        <ChatListEmpty
          description="Start a conversation by sending a message below"
          icon="💬"
          title="No messages yet"
        />
      </ChatList>
      <ChatInput
        onSubmit={() => undefined}
        onValueChange={() => undefined}
        placeholder="Type your first message..."
        value=""
      />
    </div>
  ),
};

/**
 * The quick-reaction popup shown while hovering a bubble.
 */
export const QuickReactions: Story = {
  render: function QuickReactions() {
    const [showReactions, setShowReactions] = useState(false);

    return (
      <div className="p-8">
        <div className="relative inline-block">
          <ChatBubble
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            variant="received"
          >
            Hover to see quick reactions
          </ChatBubble>
          {showReactions ? (
            <div className="absolute -top-12 left-0">
              <ChatQuickReactions
                emojis={["👍", "❤️", "😂", "😮", "😢", "🙏"]}
                onReact={() => undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  },
};
