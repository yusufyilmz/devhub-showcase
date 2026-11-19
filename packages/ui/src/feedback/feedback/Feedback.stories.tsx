import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Feedback } from "./Feedback";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Feedback description="Review your changes before publishing." title="Saved to your draft" />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Feedback",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

function DismissibleFeedback() {
  const [open, setOpen] = useState(true);

  return (
    <div className="grid max-w-md gap-sm p-md">
      <Feedback description="Your edits are saved." title="Draft updated" variant="success" />
      {open && (
        <Feedback
          description="Review the missing fields before publishing."
          onClose={() => setOpen(false)}
          title="More details needed"
          variant="warning"
        />
      )}
      <Feedback
        description="Try again when your connection returns."
        title="Could not publish"
        variant="danger"
      />
    </div>
  );
}

export const Variants: Story = { render: () => <DismissibleFeedback /> };
