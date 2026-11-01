import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollButton } from "./ScrollButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <div>
        <p id="first">First section</p>
        <ScrollButton sectionIds={["first", "second"]} />
        <p id="second" className="mt-32">
          Second section
        </p>
      </div>
    </div>
  );
}
const meta = { title: "UI/scroll-button", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
