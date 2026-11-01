import type { Meta, StoryObj } from "@storybook/react-vite";
import { Square } from "lucide-react";

import { SidebarProvider } from "../sidebar";
import { TeamSwitcher } from "./TeamSwitcher";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <SidebarProvider>
        <TeamSwitcher
          teams={[
            { logo: Square, name: "Studio North", plan: "Free" },
            { logo: Square, name: "Studio South", plan: "Pro" },
          ]}
        />
      </SidebarProvider>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/team-switcher" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
