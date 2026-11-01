import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Save draft</Button>
        </TooltipTrigger>
        <TooltipContent>Save without publishing.</TooltipContent>
      </Tooltip>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/tooltip" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
