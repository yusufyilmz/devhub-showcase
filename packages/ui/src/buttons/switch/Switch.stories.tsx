import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Actions/Switch",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
      <Switch aria-labelledby="airplane-mode" />
      <span id="airplane-mode">Airplane mode</span>
    </div>
  ),
};
