import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Forms/Slider",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-50 max-w-full">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-50 max-w-full">
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-50 max-w-full">
      <Slider defaultValue={[50]} disabled max={100} step={1} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-48">
      <Slider defaultValue={[50]} orientation="vertical" />
    </div>
  ),
};
