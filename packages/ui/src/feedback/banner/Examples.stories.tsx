import type { Meta, StoryObj } from "@storybook/react-vite";

import { Banner } from "./Banner";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Banner>Your draft is private until you publish.</Banner>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/banner" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
