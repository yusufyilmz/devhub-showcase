import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "../sidebar/Sidebar";
import { AppSidebar } from "./AppSidebar";

const providerStyles = {
  "--sidebar-width": "280px",
} as CSSProperties;

const meta = {
  component: AppSidebar,
  decorators: [
    (Story) => (
      <SidebarProvider style={providerStyles}>
        <Story />
        <SidebarInset>
          <header className="flex items-center gap-xs border-sidebar-border border-b px-md py-s">
            <SidebarTrigger />
            <span className="text-sm font-medium">Workspace</span>
          </header>
          <p className="p-md text-sm text-muted-foreground">Sidebar content preview area</p>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    pageCanvas: true,
  },
  tags: ["autodocs"],
  title: "UI/Navigation/App Sidebar",
} satisfies Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InsetVariant: Story = {
  args: {
    variant: "inset",
  },
};

export const FloatingVariant: Story = {
  args: {
    variant: "floating",
  },
};

export const Collapsible: Story = {
  args: {
    collapsible: "icon",
  },
};
