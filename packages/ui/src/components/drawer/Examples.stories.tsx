import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./Drawer";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Review your changes</DrawerTitle>
          <DrawerDescription>Your draft stays private until you publish.</DrawerDescription>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
const meta = { title: "UI/drawer", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
