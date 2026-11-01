import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarInset, SidebarProvider } from "../sidebar/Sidebar";
import { AppSidebar } from "./AppSidebar";

const providerStyles = {
  "--sidebar-width": "280px",
} as CSSProperties;

const meta = {
  component: AppSidebar,
  decorators: [
    (Story) => (
      <SidebarProvider style={providerStyles}>
        <div className="flex min-h-screen bg-background text-foreground">
          <Story />
          <SidebarInset>
            <div className="flex flex-1 items-center justify-center bg-muted/20 p-6">
              <p className="text-muted-foreground text-sm">Sidebar content preview area</p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Layout/AppSidebar",
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
