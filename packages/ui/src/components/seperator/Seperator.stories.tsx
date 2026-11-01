import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./Seperator";

/**
 * Visually or semantically separates content.
 */
const meta: Meta<typeof Separator> = {
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "radio",
      description: "The orientation of the separator",
      options: ["horizontal", "vertical"],
    },
  },
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Separator",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};
