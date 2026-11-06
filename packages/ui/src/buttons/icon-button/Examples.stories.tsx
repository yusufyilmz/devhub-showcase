import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "./IconButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex gap-3">
        <IconButton aria-label="Add item">+</IconButton>
        <IconButton aria-label="Add item" disabled>
          +
        </IconButton>
        <IconButton aria-label="Add item" variant="outline">
          +
        </IconButton>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Actions/icon-button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
