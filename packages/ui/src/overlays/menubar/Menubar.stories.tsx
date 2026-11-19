import type { Meta, StoryObj } from "@storybook/react-vite";

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./Menubar";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Portfolio</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Preview</MenubarItem>
            <MenubarItem disabled>Download CV</MenubarItem>
            <MenubarItem>PortfolioDocumentationForContributors.json</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Show drafts</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Overlays/Menubar",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
