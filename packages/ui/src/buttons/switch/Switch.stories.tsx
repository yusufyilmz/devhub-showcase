import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { StyledSwitch } from "./StyledSwitch";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  args: { "aria-label": "Notifications" },
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Buttons/Switch",
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

function PreferencesExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="grid w-full max-w-sm gap-sm p-md">
      <StyledSwitch
        checked={checked}
        description="Receive a reminder when a draft is ready to publish."
        label="Draft reminders"
        onChange={(event) => setChecked(event.currentTarget.checked)}
        variant="card"
      />
      <StyledSwitch
        checked
        disabled
        label="Account updates"
        onChange={() => undefined}
        variant="minimal"
      />
    </div>
  );
}

export const Preferences: Story = { render: () => <PreferencesExample /> };
