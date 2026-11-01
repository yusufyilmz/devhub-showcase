import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionCards } from "./SectionCards";

const meta = {
  component: SectionCards,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Dashboard/SectionCards",
} satisfies Meta<typeof SectionCards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
