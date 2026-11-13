import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardSpotlight } from "./CardSpotlight";

const meta = {
  args: {
    children: <p>Move the pointer to preview the spotlight.</p>,
    className: "w-72 max-w-full",
  },
  component: CardSpotlight,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Card Spotlight",
} satisfies Meta<typeof CardSpotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SmallSpotlight: Story = { args: { radius: 96 } };
export const Accent: Story = { args: { color: "var(--accent)" } };
