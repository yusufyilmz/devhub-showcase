import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./AspectRatio";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <AspectRatio ratio={16 / 9}>
        <div className="grid h-full place-items-center rounded-lg bg-muted">Media preview</div>
      </AspectRatio>
    </div>
  );
}
const meta = { title: "UI/aspect-ratio", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
