import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Underline } from "lucide-react";

import { Toggle } from "./Toggle";

/**
 * A two-state button that can be either on or off.
 */
const meta: Meta<typeof Toggle> = {
  args: {
    disabled: false,
    size: "default",
    variant: "default",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
    pressed: {
      control: "boolean",
      description: "The pressed state of the toggle",
    },
    size: {
      control: "select",
      description: "The size of the toggle",
      options: ["default", "sm", "lg"],
    },
    variant: {
      control: "select",
      description: "The variant of the toggle",
      options: ["default", "outline"],
    },
  },
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Buttons/Toggle",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
      Italic
    </Toggle>
  ),
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle underline">
      <Underline className="h-4 w-4" />
    </Toggle>
  ),
};
