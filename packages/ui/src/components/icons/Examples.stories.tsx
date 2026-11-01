import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatIcon, EditIcon, GitHubIcon, MenuIcon, PhoneIcon, SendIcon } from "./Icons";

const meta = { title: "UI/Icons", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="flex gap-4">
      <ChatIcon />
      <EditIcon />
      <GitHubIcon />
      <MenuIcon />
      <PhoneIcon />
      <SendIcon />
    </div>
  ),
};
export const Small: Story = {
  render: () => (
    <div className="flex gap-4">
      <ChatIcon fontSize="small" />
      <EditIcon fontSize="small" />
      <SendIcon fontSize="small" />
    </div>
  ),
};
export const Large: Story = {
  render: () => (
    <div className="flex gap-4">
      <ChatIcon fontSize="large" />
      <EditIcon fontSize="large" />
      <SendIcon fontSize="large" />
    </div>
  ),
};
