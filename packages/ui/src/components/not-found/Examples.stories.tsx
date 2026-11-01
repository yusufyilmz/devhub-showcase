import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotFound } from "./NotFound";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <NotFound title="Page not found" description="This portfolio is not available." />
    </div>
  );
}
const meta = { title: "UI/not-found", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
