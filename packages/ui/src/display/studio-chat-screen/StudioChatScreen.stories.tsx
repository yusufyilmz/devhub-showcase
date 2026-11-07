import "../../styles/components/display/studio-chat.css";

import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { StudioChatScreenOptions } from "../chat/types";
import { StudioChatScreen } from "./StudioChatScreen";

function Preview({ visitor }: Pick<StudioChatScreenOptions, "visitor">) {
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
      notice={
        visitor
          ? "This preview uses a fictional portfolio."
          : "Review every proposal. Nothing saves automatically."
      }
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
            text: visitor
              ? "Alex designed Atlas, a workspace for planning and sharing team projects."
              : "Let's refine your summary using the experience already in your portfolio. Review the proposed changes before applying them.",
          },
        ]);
        setMessage("");
      }}
      visitor={visitor}
    />
  );
}
const meta = {
  component: Preview,
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Studio Assistant",
} satisfies Meta<typeof Preview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const PortfolioVisitor: Story = {
  args: { visitor: { href: "/?path=/story/pages-portfolio--designer", name: "Alex Morgan" } },
};
