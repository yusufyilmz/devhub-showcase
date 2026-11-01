import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta: Meta<typeof Avatar> = {
  argTypes: {},
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  tags: ["autodocs"],
  title: "UI/Avatar",
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the avatar.
 */
export const Default: Story = {};
