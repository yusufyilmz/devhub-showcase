import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ContextMenu";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="rounded-lg border border-dashed p-12">Right click to view actions</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit section</ContextMenuItem>
          <ContextMenuItem>Duplicate section</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Overlays/context-menu",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
