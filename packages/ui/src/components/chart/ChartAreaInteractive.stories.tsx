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
