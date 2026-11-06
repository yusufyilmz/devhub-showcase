import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectField } from "./select-field";

const meta = {
  args: {
    children: (
      <>
        <option value="studio">Studio</option>
        <option value="paper">Paper</option>
        <option value="graphite">Graphite</option>
      </>
    ),
    label: "Portfolio layout",
    onChange: () => undefined,
    value: "studio",
  },
  component: SelectField,
  parameters: { layout: "centered" },
  render: function Editable(args) {
    const [value, setValue] = useState(args.value);
    return <SelectField {...args} onChange={setValue} value={value} />;
  },
  tags: ["autodocs"],
  title: "UI/Forms/Select Field",
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AlternateValue: Story = { args: { value: "paper" } };
export const WithUnavailableOption: Story = {
  args: {
    children: (
      <>
        <option value="studio">Studio</option>
        <option disabled value="paper">
          Paper (unavailable)
        </option>
      </>
    ),
  },
};
