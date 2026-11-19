import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./Calendar";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Calendar defaultMonth={new Date(2026, 0, 1)} mode="single" />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Calendar",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
