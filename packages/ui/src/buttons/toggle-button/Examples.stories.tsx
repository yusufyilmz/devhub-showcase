import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleButton } from "./ToggleButton";

function Example({ width = 560 }: { width?: number }) {
  const [selected, setSelected] = useState("Portfolio");
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex gap-2">
        {["Portfolio", "CV"].map((label) => (
          <ToggleButton
            key={label}
            label={label}
            onClick={() => setSelected(label)}
            selected={selected === label}
          />
        ))}
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Actions/toggle-button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
