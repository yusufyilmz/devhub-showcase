import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./Tag";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag label="Design" />
        <Tag label="Published" variant="success" />
        <Tag label="Draft" variant="warning" />
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Tag",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Variants: Story = {
  render: () => (
    <div className="mx-auto flex max-w-sm flex-wrap items-center gap-2">
      <Tag label="Portfolio" size="l" variant="brand" />
      <Tag label="Needs review" size="s" variant="info" />
      <Tag label="Unavailable" variant="danger" />
      <Tag label="Published" variant="success" />
      <Tag label="Draft" variant="warning" />
      <Tag>Storybook</Tag>
    </div>
  ),
};
