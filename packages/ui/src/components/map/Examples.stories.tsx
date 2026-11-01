import type { Meta, StoryObj } from "@storybook/react-vite";

import { LocationMap } from "./LocationMap";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <LocationMap latitude={41.3874} longitude={2.1686} title="Barcelona" />
    </div>
  );
}
const meta = { title: "UI/map", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
