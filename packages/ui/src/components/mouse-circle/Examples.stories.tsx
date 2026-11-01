import type { Meta, StoryObj } from "@storybook/react-vite";

import { MouseCircle } from "./MouseCircle";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <div className="min-h-48">
        <MouseCircle />
        <p>Move your pointer across the canvas.</p>
      </div>
    </div>
  );
}
const meta = { title: "UI/mouse-circle", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
