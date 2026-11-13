import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollButton } from "./ScrollButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div>
        <p id="first">First section</p>
        <ScrollButton sectionIds={["first", "second"]} />
        <p className="mt-32" id="second">
          Second section
        </p>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Scroll Button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
