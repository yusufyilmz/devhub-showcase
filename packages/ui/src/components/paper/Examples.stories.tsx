import type { Meta, StoryObj } from "@storybook/react-vite";

import { Paper } from "./Paper";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Paper>
        <h3>A quiet surface</h3>
        <p>Content with room to breathe.</p>
      </Paper>
    </div>
  );
}
const meta = { title: "UI/paper", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
