import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "../sidebar/Sidebar";
import { SiteHeader } from "./SiteHeader";

const meta = {
  component: SiteHeader,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarContent className="p-md">Workspace navigation</SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-48">
          <Story />
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "UI/Navigation/Site Header",
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outline">Preview</Button>
        <Button>Save changes</Button>
      </>
    ),
    title: "Workspace settings and publication preferences",
  },
};
