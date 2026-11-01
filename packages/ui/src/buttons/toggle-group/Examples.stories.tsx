import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <ToggleGroup aria-label="Alignment" defaultValue="left" type="single">
        <ToggleGroupItem aria-label="Align left" value="left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          Center
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/toggle-group" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
