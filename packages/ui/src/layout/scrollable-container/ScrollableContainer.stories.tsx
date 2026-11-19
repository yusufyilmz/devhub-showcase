import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollableContainer } from "./ScrollableContainer";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <ScrollableContainer aria-label="Projects" role="region" tabIndex={0}>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((item) => (
            <article
              className="min-w-64 rounded-lg border border-border/75 bg-card p-lg"
              key={item}
            >
              Project {item}
            </article>
          ))}
        </div>
      </ScrollableContainer>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Scrollable Container",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
