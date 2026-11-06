import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./Sheet";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Review your changes</SheetTitle>
          <SheetDescription>Your draft stays private until you publish.</SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/Overlays/sheet" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
