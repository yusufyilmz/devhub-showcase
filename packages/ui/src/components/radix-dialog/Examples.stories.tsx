import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./RadixDialog";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open radix-dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Review your changes</DialogTitle>
          <DialogDescription>Your draft stays private until you publish.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
const meta = { title: "UI/radix-dialog", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
