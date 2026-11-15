import type { Meta, StoryObj } from "@storybook/react-vite";

import { Paper } from "./Paper";
import type { PaperProps } from "./types";

function Example({ width = 560, ...props }: PaperProps & { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Paper {...props}>
        <h3 className="font-semibold tracking-tight">Workspace overview</h3>
        <p className="text-sm text-muted-foreground">Review your recent projects.</p>
      </Paper>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Paper",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Glass: Story = { args: { glassEffect: true, showAccent: false } };
