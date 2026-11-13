import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutDashboard, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./Sidebar";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="#studio" />} size="lg" tooltip="Studio home">
                  <LayoutDashboard aria-hidden="true" />
                  <span>Portfolio Studio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Your studio</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive render={<a href="#portfolio" />} tooltip="Portfolio">
                    <LayoutDashboard aria-hidden="true" />
                    <span>Portfolio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <a href="#settings">
                      <Settings aria-hidden="true" />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center gap-xs border-sidebar-border border-b px-md py-s">
            <SidebarTrigger />
            <span className="text-sm font-medium">Workspace</span>
          </header>
          <p className="p-md text-sm text-muted-foreground">Studio content</p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Navigation/Sidebar",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
