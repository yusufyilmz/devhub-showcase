import type { Meta, StoryObj } from "@storybook/react-vite";

import { Banner } from "./Banner";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      <Banner>Your draft is private until you publish.</Banner>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Banner",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
