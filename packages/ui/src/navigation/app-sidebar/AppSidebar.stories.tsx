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
          <header className="flex items-center gap-xs border-b border-sidebar-border/60 px-md py-s">
            <SidebarTrigger className="rounded-md focus-visible:outline-2 focus-visible:outline-ring" />
            <span className="text-sm font-medium">Workspace</span>
          </header>
          <section className="p-md sm:p-lg">
            <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-xs max-w-prose text-sm text-muted-foreground">
              Review your recent work and manage the projects in this workspace.
            </p>
          </section>
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
