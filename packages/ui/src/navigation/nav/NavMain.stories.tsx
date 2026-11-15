import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconSettings,
} from "@tabler/icons-react";
import { Folder } from "lucide-react";

import { SidebarProvider } from "../sidebar/Sidebar";
import { NavDocuments } from "./NavDocuments";
import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";

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

export const SidebarGroups: Story = {
  render: () => (
    <>
      <NavDocuments
        items={[{ icon: IconFileDescription, name: "Quarterly design research", url: "#report" }]}
      />
      <NavProjects
        projects={[
          { icon: Folder, name: "Navigation redesign and accessibility", url: "#project" },
        ]}
      />
      <NavSecondary
        items={[{ icon: IconSettings, title: "Workspace settings", url: "#settings" }]}
      />
      <NavUser user={{ avatar: "", email: "alex.morgan@workspace.example", name: "Alex Morgan" }} />
    </>
  ),
};
