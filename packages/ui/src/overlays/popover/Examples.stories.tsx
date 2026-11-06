import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Portfolio settings</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Your draft is private until you publish.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Overlays/popover",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
