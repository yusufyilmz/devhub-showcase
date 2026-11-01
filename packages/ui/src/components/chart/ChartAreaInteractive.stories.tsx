import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChartAreaInteractive } from "./ChartAreaInteractive";

const meta = {
  component: ChartAreaInteractive,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto w-full max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Dashboard/ChartAreaInteractive",
} satisfies Meta<typeof ChartAreaInteractive>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
};
