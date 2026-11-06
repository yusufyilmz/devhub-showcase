import type { Meta, StoryObj } from "@storybook/react-vite";

import { BackgroundShadDemo } from "./BackgroundShadDemo";

const meta = {
  title: "UI Components/Background",
  component: BackgroundShadDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof BackgroundShadDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
