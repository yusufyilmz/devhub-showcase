/**
 * Enhanced Chat Example
 * Complete chat interface using enhanced components
 */

import { useState } from "react";

import { Image as ImageIcon, Mic, Paperclip, Smile } from "lucide-react";

import {
  EnhancedChatBubble,
  EnhancedChatBubbleGroup,
  EnhancedChatBubbleReactions,
  EnhancedChatBubbleTimestamp,
} from "./chat-bubble-enhanced";
import { EnhancedChatInput, EnhancedChatInputAction } from "./chat-input-enhanced";
import {
  EnhancedChatList,
  EnhancedChatListEmpty,
  EnhancedChatListItem,
  EnhancedChatListSeparator,
} from "./chat-list-enhanced";

interface Message {
  content: string;
  id: string;
  reactions?: Array<{ emoji: string; count: number; active?: boolean }>;
  timestamp: string;
  variant: "sent" | "received";
}

export function EnhancedChatExample() {
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
                    ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 }
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
      <EnhancedChatList className="flex-1" glassEffect={false} showBottomFade showTopFade>
        {messages.length === 0 ? (
          <EnhancedChatListEmpty
            description="Start a conversation!"
            icon="💬"
            title="No messages yet"
          />
        ) : (
          <>
            <EnhancedChatListSeparator label="Today" />

            {messages.map((message) => (
              <EnhancedChatListItem isOwn={message.variant === "sent"} key={message.id}>
                <EnhancedChatBubbleGroup align={message.variant === "sent" ? "right" : "left"}>
                  <EnhancedChatBubble
                    enableGlow={message.variant === "sent"}
                    enableHover
                    maxWidth="80%"
                    variant={message.variant}
                  >
                    {message.content}
                  </EnhancedChatBubble>

                  <EnhancedChatBubbleTimestamp showIcon time={message.timestamp} />

                  {message.reactions && message.reactions.length > 0 && (
                    <EnhancedChatBubbleReactions
                      onReactionClick={(emoji) => handleReaction(message.id, emoji)}
                      reactions={message.reactions}
                    />
                  )}
                </EnhancedChatBubbleGroup>
              </EnhancedChatListItem>
            ))}
          </>
        )}
      </EnhancedChatList>

      {/* Chat Input */}
      <EnhancedChatInput
        glassInput={false}
        leftActions={
          <>
            <EnhancedChatInputAction icon={<Paperclip className="h-4 w-4" />} label="Attach file" />
            <EnhancedChatInputAction icon={<ImageIcon className="h-4 w-4" />} label="Send image" />
          </>
        }
        maxLength={500}
        onSubmit={handleSend}
        onValueChange={setInputValue}
        placeholder="Type your message..."
        rightActions={
          <>
            <EnhancedChatInputAction icon={<Smile className="h-4 w-4" />} label="Add emoji" />
            <EnhancedChatInputAction
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

export default EnhancedChatExample;
