import type { Meta, StoryObj } from "@storybook/react-vite";

import { IFramePreview } from "./IFramePreview";

function Example({ scale = 1, width = 560 }: { scale?: number; width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <IFramePreview scale={scale} url="/examples/atlas-interface.svg" />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Display/iframe-preview",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const ZoomedOut: Story = { args: { scale: 0.5 } };
