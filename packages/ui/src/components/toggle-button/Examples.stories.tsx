import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleButton } from "./ToggleButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <div className="flex gap-2">
        <ToggleButton label="Portfolio" selected />
        <ToggleButton label="CV" />
      </div>
    </div>
  );
}
const meta = { title: "UI/toggle-button", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
