import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedToolsCard } from "./AnimatedToolsCard";

const meta = {
  args: { description: "Compose and automate portfolio tasks.", title: "Developer toolkit" },
  component: AnimatedToolsCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Animated Tools Card",
} satisfies Meta<typeof AnimatedToolsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TitleOnly: Story = { args: { description: undefined } };
export const LongDescription: Story = {
  args: {
    description:
      "A collection of tools for preparing previews, validating changes, and publishing a portfolio from one workspace.",
  },
};
