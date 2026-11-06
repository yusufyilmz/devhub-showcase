import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "./field";

const meta = {
  args: { label: "Display name", onChange: () => undefined, value: "Mina Chen" },
  component: Field,
  parameters: { layout: "centered" },
  render: function Editable(args) {
    const [value, setValue] = useState(args.value);
    return <Field {...args} onChange={setValue} value={value} />;
  },
  tags: ["autodocs"],
  title: "UI/Forms/Field",
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = {
  args: { hint: "This name appears on your portfolio.", required: true },
};
export const Multiline: Story = {
  args: { label: "About you", multiline: true, value: "Design engineer and photographer." },
};
