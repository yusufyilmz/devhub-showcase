import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";

function Example({
  width = 560,
  direction = "horizontal",
}: {
  width?: number;
  direction?: "horizontal" | "vertical";
}) {
  return (
    <div style={{ height: 272, maxWidth: width, padding: 24, width: "100%" }}>
      <ResizablePanelGroup
        className="rounded-lg border border-border/75 bg-card"
        direction={direction}
      >
        <ResizablePanel>
          <div className="p-md">Preview</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize preview and editor" withHandle />
        <ResizablePanel>
          <div className="p-md">Editor</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Resizable",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Vertical: Story = { args: { direction: "vertical" } };
