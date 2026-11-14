import type { Meta, StoryObj } from "@storybook/react-vite";

import { VariantCard } from "./VariantCard";

const meta = {
  args: { children: <p>Preview the new workspace layout.</p>, className: "w-[min(85vw,18rem)]" },
  component: VariantCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Variant Card",
} satisfies Meta<typeof VariantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Glass: Story = { args: { variant: "glass" } };
export const Elevated: Story = { args: { variant: "elevated" } };
