import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./Skeleton";

/**
 * Use to show a placeholder while content is loading.
 */
const meta: Meta<typeof Skeleton> = {
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Feedback/Skeleton",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-[100px] h-[20px] rounded-full",
  },
};

export const Card: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="mx-auto flex w-full max-w-80 items-center gap-md">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-s">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
