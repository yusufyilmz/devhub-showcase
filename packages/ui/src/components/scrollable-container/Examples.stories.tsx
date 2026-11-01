import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollableContainer } from "./ScrollableContainer";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <ScrollableContainer>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((item) => (
            <article className="min-w-64 rounded-lg border p-6" key={item}>
              Project {item}
            </article>
          ))}
        </div>
      </ScrollableContainer>
    </div>
  );
}
const meta = {
  title: "UI/scrollable-container",
  component: Example,
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
