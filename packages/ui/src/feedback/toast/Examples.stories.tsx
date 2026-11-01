import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Toaster, toast } from "./Toast";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Toaster>
        <Button
          onClick={() =>
            toast.add({
              description: "Your changes are private.",
              title: "Draft saved",
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
const meta = { component: Example, tags: ["autodocs"], title: "UI/toast" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
