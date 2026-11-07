import React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { Badge } from "../../feedback/badge";
import { FlexCol, FlexRow } from "../../layout/flex";
import { Typography } from "../typography";
import { Chat, type ChatMessage } from "./Chat";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatSidebar } from "./ChatSidebar";
import { ChatTypingIndicator } from "./ChatTypingIndicator";

const ChatDemo: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      content: "Hey everyone! 👋 How is everyone doing today?",
      id: "1",
      isOwn: false,
      sender: {
        avatar: "/avatars/alice.jpg",
        id: "alice",
        name: "Alice Johnson",
        status: "online",
      },
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    {
      content:
        "Great! Just finished working on the new feature. The UI components are looking amazing! 🎨",
      id: "2",
      isOwn: false,
      sender: {
        avatar: "/avatars/bob.jpg",
        id: "bob",
        name: "Bob Smith",
        status: "online",
      },
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
    },
    {
      content:
        "That's awesome! I love how the theme system works with all the components. The dark mode looks incredible! 🌙",
      id: "3",
      isOwn: true,
      sender: {
        avatar: "/avatars/me.jpg",
        id: "current-user",
        name: "You",
        status: "online",
      },
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: "text",
    },
    {
      content:
        "Absolutely! The design system is so consistent. Every component follows the same patterns and uses the CSS variables perfectly.",
      id: "4",
      isOwn: false,
      sender: {
        avatar: "/avatars/alice.jpg",
        id: "alice",
        name: "Alice Johnson",
        status: "online",
      },
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
    },
    {
      content:
        "I'm really excited about the new Chat component we just built! It uses all the UI v2 components and follows the design system perfectly.",
      id: "5",
      isOwn: true,
      sender: {
        avatar: "/avatars/me.jpg",
        id: "current-user",
        name: "You",
        status: "online",
      },
      status: "delivered",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: "text",
    },
    {
      content: "The typing indicators and message status are such nice touches! 🚀",
      id: "6",
      isOwn: false,
      sender: {
        avatar: "/avatars/bob.jpg",
        id: "bob",
        name: "Bob Smith",
        status: "online",
      },
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
    },
  ]);

  const [typingUsers, setTypingUsers] = React.useState<string[]>([]);
  const [currentUser] = React.useState({
    avatar: "/avatars/me.jpg",
    id: "current-user",
    name: "You",
  });

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      content,
      id: Date.now().toString(),
      isOwn: true,
      sender: currentUser,
      status: "sending",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" as const } : msg)),
      );
    }, 1000);

    // Simulate read status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" as const } : msg)),
      );
    }, 3000);
  };

  const handleTyping = (isTyping: boolean) => {
    if (isTyping) {
      setTypingUsers(["Alice Johnson", "Bob Smith"]);
    } else {
      setTypingUsers([]);
    }
  };

  const addSampleMessage = () => {
    const sampleMessages = [
      "This is amazing! 🎉",
      "The design system is so clean and consistent.",
      "I love how everything uses theme variables!",
      "The components are so well thought out.",
      "This is exactly what we needed! ✨",
    ];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const randomSender = Math.random() > 0.5 ? "alice" : "bob";
    const senderName = randomSender === "alice" ? "Alice Johnson" : "Bob Smith";
    const senderAvatar = randomSender === "alice" ? "/avatars/alice.jpg" : "/avatars/bob.jpg";

    const newMessage: ChatMessage = {
      content: randomMessage ?? "",
      id: Date.now().toString(),
      isOwn: false,
      sender: {
        avatar: senderAvatar,
        id: randomSender,
        name: senderName,
        status: "online",
      },
      status: "read",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <FlexCol className="p-3 sm:p-6" gap="lg">
      {/* Header */}
      <div>
        <Typography className="font-bold mb-4" variant="h1">
          Chat Component Demo
        </Typography>
        <Typography className="text-[var(--muted-foreground)]" variant="body1">
          A comprehensive chat component built with UI v2 components, featuring real-time messaging,
          typing indicators, and theme integration.
        </Typography>
      </div>

      {/* Chat Component */}
      <Card className="p-3 sm:p-5">
        <Typography className="font-semibold mb-4" variant="h3">
          Live Chat Demo
        </Typography>
        <div className="h-[clamp(38rem,82dvh,54rem)]">
          <Chat
            currentUser={currentUser}
            fullHeight
            fullWidth
            maxLength={500}
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            placeholder="Type your message here..."
            shadow="lg"
            size="lg"
            typingUsers={typingUsers}
            variant="card"
          />
        </div>
      </Card>

      {/* Features Overview */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Features
        </Typography>
        <FlexCol gap="sm">
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Real-time messaging with message status</Typography>
          </FlexRow>
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Typing indicators for multiple users</Typography>
          </FlexRow>
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Theme-aware design with CSS variables</Typography>
          </FlexRow>
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Avatar integration with status indicators</Typography>
          </FlexRow>
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Responsive layout with proper scrolling</Typography>
          </FlexRow>
          <FlexRow align="center" gap="sm">
            <Badge variant="default">✓</Badge>
            <Typography variant="body2">Built entirely with UI v2 components</Typography>
          </FlexRow>
        </FlexCol>
      </Card>

      {/* Interactive Controls */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Interactive Controls
        </Typography>
        <FlexRow gap="md" wrap="wrap">
          <Button onClick={addSampleMessage} variant="outline">
            <Typography variant="body2">Add Sample Message</Typography>
          </Button>
          <Button onClick={clearMessages} variant="outline">
            <Typography variant="body2">Clear Messages</Typography>
          </Button>
          <Button onClick={() => setTypingUsers(["Alice Johnson"])} variant="outline">
            <Typography variant="body2">Simulate Typing</Typography>
          </Button>
        </FlexRow>
      </Card>

      {/* Individual Components Demo */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Individual Chat Components
        </Typography>
        <FlexCol gap="md">
          <div>
            <Typography className="mb-2" variant="h6">
              ChatHeader
            </Typography>
            <ChatHeader
              messageCount={42}
              status="online"
              subtitle="5 members online"
              title="Development Team"
            />
          </div>

          <div>
            <Typography className="mb-2" variant="h6">
              ChatMessageBubble
            </Typography>
            <FlexCol gap="sm">
              <ChatMessageBubble
                message={{
                  content: "Hey team! How is the new feature coming along?",
                  id: "1",
                  isOwn: false,
                  sender: {
                    avatar: "/avatars/alice.jpg",
                    id: "alice",
                    name: "Alice Johnson",
                    status: "online",
                  },
                  status: "read",
                  timestamp: new Date(),
                  type: "text",
                }}
              />
              <ChatMessageBubble
                message={{
                  content: "Great progress! The UI components are looking amazing! 🎨",
                  id: "2",
                  isOwn: true,
                  sender: {
                    avatar: "/avatars/me.jpg",
                    id: "current-user",
                    name: "You",
                    status: "online",
                  },
                  status: "delivered",
                  timestamp: new Date(),
                  type: "text",
                }}
              />
            </FlexCol>
          </div>

          <div>
            <Typography className="mb-2" variant="h6">
              ChatInput
            </Typography>
            <ChatInput
              onChange={() => {
                /* preview only */
              }}
              onSend={() => {
                /* preview only */
              }}
              placeholder="Type your message..."
              value=""
            />
          </div>

          <div>
            <Typography className="mb-2" variant="h6">
              ChatTypingIndicator
            </Typography>
            <ChatTypingIndicator users={["Alice Johnson", "Bob Smith"]} />
          </div>
        </FlexCol>
      </Card>

      {/* Chat Sidebar Demo */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Chat Sidebar
        </Typography>
        <div className="h-[400px]">
          <ChatSidebar
            onNewChat={() => console.log("New chat")}
            onSettings={() => console.log("Settings")}
            searchPlaceholder="Search conversations..."
            subtitle="Stay connected with your team"
            title="Chats"
          />
        </div>
      </Card>

      {/* Variants Demo */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Chat Variants
        </Typography>
        <FlexCol gap="md">
          <div>
            <Typography className="mb-2" variant="h6">
              Default Variant
            </Typography>
            <div className="h-[300px]">
              <Chat
                fullHeight
                fullWidth
                messages={messages.slice(0, 3)}
                onSendMessage={handleSendMessage}
                size="md"
                variant="default"
              />
            </div>
          </div>

          <div>
            <Typography className="mb-2" variant="h6">
              Ghost Variant
            </Typography>
            <div className="h-[300px]">
              <Chat
                fullHeight
                fullWidth
                messages={messages.slice(0, 3)}
                onSendMessage={handleSendMessage}
                shadow="none"
                size="sm"
                variant="ghost"
              />
            </div>
          </div>
        </FlexCol>
      </Card>

      {/* Usage Examples */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          Usage Examples
        </Typography>
        <FlexCol gap="md">
          <div>
            <Typography className="mb-2" variant="h6">
              Basic Usage
            </Typography>
            <div className="bg-[var(--muted)] p-4 rounded-lg">
              <pre className="text-sm text-[var(--foreground)]">
                {`<Chat
  messages={messages}
  onSendMessage={handleSendMessage}
  onTyping={handleTyping}
  typingUsers={typingUsers}
  currentUser={currentUser}
  fullWidth
  fullHeight
/>`}
              </pre>
            </div>
          </div>

          <div>
            <Typography className="mb-2" variant="h6">
              With Custom Props
            </Typography>
            <div className="bg-[var(--muted)] p-4 rounded-lg">
              <pre className="text-sm text-[var(--foreground)]">
                {`<Chat
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Type a message..."
  maxLength={1000}
  variant="card"
  size="lg"
  shadow="xl"
  fullWidth
  fullHeight
/>`}
              </pre>
            </div>
          </div>
        </FlexCol>
      </Card>
    </FlexCol>
  );
};

const meta = {
  component: ChatDemo,
  parameters: { layout: "fullscreen" },
  title: "UI/Display/Chat",
} satisfies Meta<typeof ChatDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Demo,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Demo,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
