import type { Meta, StoryObj } from "@storybook/react-vite";

import { SegmentedControl } from "./SegmentedControl";

function Example({ width = 560, longLabel = false }: { width?: number; longLabel?: boolean }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <SegmentedControl
        buttons={[
          {
            label: longLabel ? "Published portfolio and project archive" : "Portfolio",
            value: "portfolio",
          },
          { label: "CV", value: "cv" },
        ]}
        onToggle={() => undefined}
      />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Buttons/Segmented Control",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
export const LongLabel: Story = { args: { longLabel: true, width: 220 } };
