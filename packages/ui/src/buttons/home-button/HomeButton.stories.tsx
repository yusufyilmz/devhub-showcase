import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeButton } from "./HomeButton";

const meta = {
  component: HomeButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Actions/Home Button",
} satisfies Meta<typeof HomeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InNavigation: Story = {
  render: () => (
    <nav aria-label="Recovery">
      <HomeButton />
    </nav>
  ),
};
export const AfterAnError: Story = {
  render: () => (
    <div className="space-y-3">
      <p>This page could not load.</p>
      <HomeButton />
    </div>
  ),
};
