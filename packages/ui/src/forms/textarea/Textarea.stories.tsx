import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Forms/Textarea",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea",
  },
};

export const WithValue: Story = {
  args: {
    value: "This is a sample text in the textarea component.",
  },
};
