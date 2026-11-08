import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@shared/ui/button";

import { ChatComposer } from "./ChatComposer";

const meta = {
  args: { onChange: () => undefined, onSubmit: () => undefined, value: "" },
  component: ChatComposer,
  decorators: [
    (Story) => (
      <div className="w-[min(85vw,34rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  render: function Editable(args) {
    const [value, setValue] = useState(args.value);
    return (
      <ChatComposer {...args} onChange={setValue} onSubmit={() => setValue("")} value={value} />
    );
  },
  tags: ["autodocs"],
  title: "UI/Display/Chat Composer",
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Draft: Story = { args: { value: "Help me organize my portfolio." } };
export const WithControls: Story = {
  args: {
    controls: (
      <Button size="sm" variant="ghost">
        Choose tone
      </Button>
    ),
  },
};
