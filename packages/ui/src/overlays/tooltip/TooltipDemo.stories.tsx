import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "UI Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip title="This is a tooltip">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip title="Information tooltip">
      <Button variant="ghost" size="sm">
        ℹ️
      </Button>
    </Tooltip>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Tooltip title="Save your changes">
        <Button variant="outline">Save</Button>
      </Tooltip>

      <Tooltip title="Delete this item">
        <Button variant="outline">Delete</Button>
      </Tooltip>

      <Tooltip title="Edit this item">
        <Button variant="outline">Edit</Button>
      </Tooltip>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <Tooltip title="This is a longer tooltip that demonstrates how the tooltip handles longer text content and wraps appropriately.">
      <Button variant="outline">Long tooltip</Button>
    </Tooltip>
  ),
};
