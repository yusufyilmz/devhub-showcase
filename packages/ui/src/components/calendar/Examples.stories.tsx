import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./Calendar";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} />
    </div>
  );
}
const meta = { title: "UI/calendar", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
