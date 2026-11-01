import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
} from ".";

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
                    { icon: <span>👍</span>, label: "React", onClick: () => undefined },
                    { icon: <span>↪</span>, label: "Reply", onClick: () => undefined },
                    { icon: <span>➤</span>, label: "Forward", onClick: () => undefined },
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
                  { icon: <span>✎</span>, label: "Edit", onClick: () => undefined },
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
      { fallback: "A", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
      { fallback: "B", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
      { fallback: "C", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
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
