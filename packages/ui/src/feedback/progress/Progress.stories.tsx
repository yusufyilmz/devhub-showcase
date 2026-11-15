import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "./Progress";

/**
 * Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
 */
const meta: Meta<typeof Progress> = {
  args: {
    "aria-label": "Task progress",
    max: 100,
    value: 33,
  },
  argTypes: {
    max: {
      control: "number",
      description: "The maximum progress value",
    },
    value: {
      control: "number",
      description: "The progress value",
    },
  },
  component: Progress,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  title: "UI/Feedback/Progress",
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the progress bar.
 */
export const Default: Story = {};

export const HalfComplete: Story = {
  args: {
    value: 50,
  },
};

export const NearlyComplete: Story = {
  args: {
    value: 90,
  },
};

export const CustomMaximum: Story = { args: { max: 200, value: 50 } };

export const Complete: Story = { args: { value: 100 } };

export const Indeterminate: Story = { args: { value: null } };
