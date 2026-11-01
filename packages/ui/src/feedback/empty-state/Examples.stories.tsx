import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState } from "./EmptyState";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <EmptyState
        description="Your next idea belongs here."
        height="280px"
        title="No projects yet"
      />
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/empty-state" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
