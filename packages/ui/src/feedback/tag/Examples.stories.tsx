import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./Tag";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex gap-2">
        <Tag label="Design" />
        <Tag label="Published" variant="success" />
        <Tag label="Draft" variant="warning" />
      </div>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/Feedback/tag" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
