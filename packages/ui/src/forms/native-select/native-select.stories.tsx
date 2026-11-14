import type { Meta, StoryObj } from "@storybook/react-vite";

import { NativeSelect } from "./native-select";

const meta = {
  args: {
    "aria-label": "Appearance",
    children: (
      <>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </>
    ),
    defaultValue: "system",
  },
  component: NativeSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Forms/Native Select",
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = { args: { disabled: true } };
export const OptionGroups: Story = {
  args: {
    "aria-label": "Time zone",
    children: (
      <>
        <optgroup label="Europe">
          <option value="madrid">Madrid</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="tokyo">Tokyo</option>
        </optgroup>
      </>
    ),
    defaultValue: ["madrid"],
    multiple: true,
  },
};
