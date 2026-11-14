import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppearanceCard } from "./AppearanceCard";

const meta = {
  args: { children: <p>Portfolio appearance settings</p>, className: "w-[min(85vw,18rem)]" },
  component: AppearanceCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Appearance Card",
} satisfies Meta<typeof AppearanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = { args: { appearance: "muted" } };
export const Accent: Story = { args: { accent: { position: "bottom" }, enableHover: true } };
