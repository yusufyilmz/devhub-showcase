import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "../../buttons/button";
import { SonnerToaster } from "./Sonner";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <SonnerToaster id="storybook-sonner" />
      <Button onClick={() => toast.success("Draft saved", { toasterId: "storybook-sonner" })}>
        Show notification
      </Button>
    </div>
  );
}

const meta = { component: Example, tags: ["autodocs"], title: "UI/Feedback/Sonner" } satisfies Meta<
  typeof Example
>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
