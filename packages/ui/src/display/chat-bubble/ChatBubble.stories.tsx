import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatBubble } from "./ChatBubble";

const meta = {
  args: { children: "Your draft is ready to review.", maxWidth: "18rem" },
  component: ChatBubble,
  title: "UI/Display/Chat Bubble",
} satisfies Meta<typeof ChatBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Received: Story = { args: { variant: "received" } };

export const Sent: Story = { args: { children: "Thanks, I’ll review it now.", variant: "sent" } };
