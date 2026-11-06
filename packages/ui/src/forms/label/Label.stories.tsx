import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./Label";

/**
 * Renders an accessible label associated with controls.
 */
const meta: Meta<typeof Label> = {
  args: {
    children: "Label",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Label content",
    },
  },
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Forms/Label",
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the label.
 */
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
