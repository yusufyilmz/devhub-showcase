import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollToTop } from "./ScrollToTop";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <div className="min-h-96">
        <p>Scroll the canvas to reveal the top action.</p>
        <ScrollToTop />
      </div>
    </div>
  );
}
const meta = { title: "UI/scroll-to-top", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
