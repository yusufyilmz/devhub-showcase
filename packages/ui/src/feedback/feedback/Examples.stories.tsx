import type { Meta, StoryObj } from "@storybook/react-vite";

import { Feedback } from "./Feedback";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Feedback description="Review your changes before publishing." title="Saved to your draft" />
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/feedback" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
