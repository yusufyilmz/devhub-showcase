import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "./Chip";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex flex-wrap gap-s">
        <Chip label="Design" />
        <Chip label="Development" selected={false} />
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Chip",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Interactive: Story = {
  render: function InteractiveChips() {
    const [selected, setSelected] = useState(false);
    const [visible, setVisible] = useState(true);

    return (
      <div className="flex flex-wrap gap-s">
        <Chip label="Design" onClick={() => setSelected(!selected)} selected={selected} />
        {visible && <Chip label="Development" onRemove={() => setVisible(false)} />}
      </div>
    );
  },
};
