import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollToTop } from "./ScrollToTop";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="min-h-96">
        <p>Scroll the canvas to reveal the top action.</p>
        <ScrollToTop />
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Scroll To Top",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
