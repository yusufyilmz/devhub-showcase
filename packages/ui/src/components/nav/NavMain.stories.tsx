import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconDashboard, IconDatabase, IconFileDescription } from "@tabler/icons-react";

import { NavMain } from "./NavMain";

const meta = {
  args: {
    items: [
      { icon: IconDashboard, title: "Dashboard", url: "/dashboard" },
      { icon: IconDatabase, title: "Data Library", url: "/data-library" },
      { icon: IconFileDescription, title: "Documents", url: "/documents" },
    ],
  },
  component: NavMain,
  decorators: [
    (Story) => (
      <div className="w-72 rounded-lg border bg-card p-3">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Navigation/NavMain",
} satisfies Meta<typeof NavMain>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutIcons: Story = {
  args: {
    items: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Reports", url: "/reports" },
      { title: "Settings", url: "/settings" },
    ],
  },
};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
};
