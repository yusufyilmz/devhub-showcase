import type { Meta, StoryObj } from "@storybook/react-vite";
import { Square } from "lucide-react";

import { SidebarProvider } from "../sidebar";
import { TeamSwitcher } from "./TeamSwitcher";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <SidebarProvider>
        <TeamSwitcher
          teams={[
            { name: "Studio North", logo: Square, plan: "Free" },
            { name: "Studio South", logo: Square, plan: "Pro" },
          ]}
        />
      </SidebarProvider>
    </div>
  );
}
const meta = { title: "UI/team-switcher", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
