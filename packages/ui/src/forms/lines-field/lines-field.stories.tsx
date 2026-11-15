import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinesField } from "./lines-field";

const meta = {
  args: { label: "Skills", onChange: () => undefined, value: ["TypeScript", "UI design"] },
  component: LinesField,
  parameters: { layout: "centered" },
  render: function Editable(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div className="w-[min(85vw,24rem)]">
        <LinesField {...args} onChange={setValue} value={value} />
      </div>
    );
  },
  tags: ["autodocs"],
  title: "UI/Forms/Lines Field",
} satisfies Meta<typeof LinesField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { value: [] } };
export const CustomHint: Story = {
  args: {
    hint: "Add one highlight per line.",
    label: "Highlights to include in your published portfolio",
  },
};
