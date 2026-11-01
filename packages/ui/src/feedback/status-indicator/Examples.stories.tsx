import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusIndicator } from "./StatusIndicator";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex items-center gap-3">
        <StatusIndicator ariaLabel="Available" color="green" />
        <span>Available for projects</span>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/status-indicator",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
