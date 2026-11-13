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
  title: "UI/Cards/Section Cards",
} satisfies Meta<typeof SectionCards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
