import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <div>
        <p>Introduction</p>
        <Divider />
        <p>Selected work</p>
      </div>
    </div>
  );
}
const meta = { title: "UI/divider", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
