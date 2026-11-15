import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconDashboard, IconDatabase, IconFileDescription } from "@tabler/icons-react";

import { SidebarProvider } from "../sidebar/Sidebar";
import { NavMain } from "./NavMain";

const meta = {
  args: {
    items: [
      { icon: IconDashboard, title: "Dashboard", url: "#dashboard" },
      {
        icon: IconDatabase,
        items: [{ title: "Saved reports", url: "#saved-reports" }],
        title: "Data Library",
        url: "#data-library",
      },
      { icon: IconFileDescription, title: "Documents", url: "/documents" },
    ],
  },
  component: NavMain,
  decorators: [
    (Story) => (
      <SidebarProvider className="min-h-0">
        <section className="w-full max-w-72 rounded-xl border border-sidebar-border/70 bg-sidebar p-xs">
          <Story />
        </section>
      </SidebarProvider>
    ),
  ],
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "UI/Navigation/Nav/Nav Main",
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
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
