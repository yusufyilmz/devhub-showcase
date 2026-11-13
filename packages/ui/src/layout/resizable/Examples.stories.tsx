import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <ResizablePanelGroup className="min-h-48 rounded-lg border" direction="horizontal">
        <ResizablePanel>
          <div className="p-6">Preview</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="p-6">Editor</div>
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
