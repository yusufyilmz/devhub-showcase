import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const meta: Meta<typeof Select> = {
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Select",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger style={{ width: 180 }}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};
