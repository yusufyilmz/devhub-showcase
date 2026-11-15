import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
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
        <ContextMenuTrigger asChild>
          <Button className="h-auto w-full whitespace-normal p-md" variant="outline">
            Right click to view actions
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit section</ContextMenuItem>
          <ContextMenuItem disabled>Delete section</ContextMenuItem>
          <ContextMenuItem>PortfolioDocumentationForContributors.json</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Overlays/Context Menu",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
