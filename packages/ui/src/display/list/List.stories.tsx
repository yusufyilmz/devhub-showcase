import type { Meta, StoryObj } from "@storybook/react-vite";

import { List } from "./List";
import { ListItem } from "./ListItem";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <List divider>
        <ListItem>Introduction</ListItem>
        <ListItem>Selected work</ListItem>
        <ListItem>Contact</ListItem>
      </List>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Display/List",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
