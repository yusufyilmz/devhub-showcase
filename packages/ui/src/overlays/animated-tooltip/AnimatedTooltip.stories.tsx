import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { AnimatedTooltip } from "./AnimatedTooltip";

const meta = {
  args: { children: <Button variant="outline">Preview</Button>, content: "Open the preview" },
  component: AnimatedTooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Overlays/Animated Tooltip",
} satisfies Meta<typeof AnimatedTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TracksPointer: Story = { args: { followCursor: true, variant: "gradient" } };
export const RightPlacement: Story = { args: { offset: 16, placement: "right", variant: "dark" } };
