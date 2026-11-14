import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";

import { Button } from "../../buttons/button/Button";
import { Banner } from "./Banner";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      <Banner>Your draft is private until you publish.</Banner>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Banner",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const WithAction: Story = {
  render: function ActionBanner() {
    const [dismissed, setDismissed] = useState(false);

    return dismissed ? (
      <p role="status">Announcement dismissed.</p>
    ) : (
      <div className="mx-auto w-full max-w-xl">
        <Banner className="justify-between text-start">
          <span className="flex min-w-0 items-center gap-xs">
            <Info aria-hidden="true" className="size-4 shrink-0 text-primary" />
            Review your draft before publishing.
          </span>
          <Button onClick={() => setDismissed(true)} size="sm" type="button" variant="secondary">
            Dismiss
          </Button>
        </Banner>
      </div>
    );
  },
};
