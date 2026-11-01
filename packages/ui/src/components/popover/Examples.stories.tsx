import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
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
const meta = { title: "UI/popover", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
