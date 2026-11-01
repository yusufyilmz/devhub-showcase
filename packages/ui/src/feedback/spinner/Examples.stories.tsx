import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./Spinner";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex gap-4">
        <Spinner size={16} />
        <Spinner />
        <Spinner size={36} />
      </div>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/spinner" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
