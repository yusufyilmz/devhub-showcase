import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotFound } from "./NotFound";

const meta = {
  component: NotFound,
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "UI/Layout/Page Variants/Recovery Pages",
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
