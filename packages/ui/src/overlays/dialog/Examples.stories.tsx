import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./Dialog";

function Example({ size = "md", width = 960 }: { size?: "sm" | "md" | "lg"; width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent size={size}>
          <DialogTitle>Review your changes</DialogTitle>
          <DialogDescription>
            Your draft stays private until you publish. Small, medium, and large dialogs share the
            same layout and only change the maximum width.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
const meta = {
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  component: Example,
  tags: ["autodocs"],
  title: "UI/Overlays/Dialog",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };
export const Narrow: Story = { args: { size: "md", width: 320 } };
