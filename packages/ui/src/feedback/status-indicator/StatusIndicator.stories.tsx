import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusIndicator } from "./StatusIndicator";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex items-center gap-s">
        <StatusIndicator ariaLabel="Available" color="green" />
        <span>Available for projects</span>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Status Indicator",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const ColorsAndSizes: Story = {
  render: () => (
    <div className="mx-auto grid w-36 gap-s">
      <StatusIndicator ariaLabel="Information" color="blue" size="s" />
      <StatusIndicator ariaLabel="Offline" color="gray" size="m" />
      <StatusIndicator ariaLabel="Available" color="green" size="l" />
      <StatusIndicator ariaLabel="Away" color="orange" />
      <StatusIndicator ariaLabel="Unavailable" color="red" />
      <StatusIndicator ariaLabel="Waiting" color="yellow" />
      <div className="flex w-24 items-center gap-s">
        <StatusIndicator ariaLabel="Busy" color="red" size="l" />
        <span className="min-w-0 wrap-anywhere">Temporarily unavailable</span>
      </div>
    </div>
  ),
};
