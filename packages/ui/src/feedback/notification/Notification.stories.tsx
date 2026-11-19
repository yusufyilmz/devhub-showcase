import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { SnackbarNotification } from "./Notification";
import type { SnackbarNotificationProps } from "./types";

function Example({
  width = 560,
  severity = "success",
  message = "Saved to your draft",
}: Partial<Pick<SnackbarNotificationProps, "severity" | "message">> & { width?: number }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Button onClick={() => setOpen(true)} variant="outline">
        Show notification
      </Button>
      <SnackbarNotification
        message={message}
        onClose={() => setOpen(false)}
        open={open}
        severity={severity}
      />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Notification",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
export const SaveFailure: Story = {
  args: {
    message: "Your draft could not be saved. Check your connection and try again.",
    severity: "error",
  },
};
