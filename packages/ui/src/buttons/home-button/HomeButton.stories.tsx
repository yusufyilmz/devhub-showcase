import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeButton } from "./HomeButton";

const meta = {
  component: HomeButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Buttons/Home Button",
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
    <div className="grid justify-items-start gap-sm rounded-xl border border-border/75 bg-card p-md">
      <p className="text-sm text-muted-foreground">This page could not load.</p>
      <HomeButton />
    </div>
  ),
};
