import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeButton } from "../home-button/HomeButton";
import { GoBackButton } from "./GoBackButton";

const meta = {
  component: GoBackButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Actions/Go Back Button",
} satisfies Meta<typeof GoBackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InHeader: Story = {
  render: () => (
    <header className="flex items-center gap-4">
      <GoBackButton />
      <h2>Project details</h2>
    </header>
  ),
};
export const WithHomeAction: Story = {
  render: () => (
    <div className="flex gap-3">
      <GoBackButton />
      <HomeButton />
    </div>
  ),
};
