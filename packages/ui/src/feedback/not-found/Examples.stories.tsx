import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotFound } from "./NotFound";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <NotFound description="This portfolio is not available." title="Page not found" />
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/not-found" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
