import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarProvider } from "../sidebar/Sidebar";
import { SiteHeader } from "./SiteHeader";

const meta = {
  component: SiteHeader,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="min-h-48 bg-background text-foreground">
          <Story />
        </div>
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
