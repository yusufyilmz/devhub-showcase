import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { SnackbarNotification } from "./Notification";

function Example({ width = 560 }: { width?: number }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Button onClick={() => setOpen(true)} variant="outline">
        Show notification
      </Button>
      <SnackbarNotification
        message="Saved to your draft"
        onClose={() => setOpen(false)}
        open={open}
        severity="success"
      />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/notification",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
