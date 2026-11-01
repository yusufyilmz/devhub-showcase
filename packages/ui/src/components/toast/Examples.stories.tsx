import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Toaster, toast } from "./Toast";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Toaster>
        <Button
          onClick={() =>
            toast.add({
              title: "Draft saved",
              description: "Your changes are private.",
              type: "success",
            })
          }
        >
          Show toast
        </Button>
      </Toaster>
    </div>
  );
}
const meta = { title: "UI/toast", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
