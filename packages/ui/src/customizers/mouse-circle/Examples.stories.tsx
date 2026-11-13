import type { Meta, StoryObj } from "@storybook/react-vite";

import { MouseCircle } from "./MouseCircle";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="min-h-48">
        <MouseCircle />
        <p>Move your pointer across the canvas.</p>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Customizers/Mouse Circle",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
