import "../chat/studio-chat.css";

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioChatScreen } from "./StudioChatScreen";

function Preview() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id: number; role: "user" | "assistant"; text: string }[]
  >([]);
  return (
    <StudioChatScreen
      busy={false}
      disabled={false}
      editorHref="/admin"
      message={message}
      messages={messages}
      notice="Review every proposal. Nothing saves automatically."
      onMessageChange={setMessage}
      onReset={() => {
        setMessage("");
        setMessages([]);
      }}
      onStop={() => setMessage("")}
      onSubmit={() => {
        setMessages([
          { id: 1, role: "user", text: message },
          {
            id: 2,
            role: "assistant",
            text: "Let's refine your summary using the experience already in your portfolio. Review the proposed changes before applying them.",
          },
        ]);
        setMessage("");
      }}
    />
  );
}
const meta = {
  component: Preview,
  parameters: { layout: "fullscreen" },
  title: "Studio/Assistant",
} satisfies Meta<typeof Preview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
