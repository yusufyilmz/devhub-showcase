import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoginForm } from "./LoginForm";

const meta = {
  component: LoginForm,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Auth/LoginForm",
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomClassName: Story = {
  args: {
    className: "border border-dashed rounded-lg p-4",
  },
};
