import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageHeader } from "./PageHeader";

function Example({
  width = 560,
  title = "Your studio",
  subtitle = "A place for your next chapter.",
}: {
  width?: number;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <PageHeader subtitle={subtitle} title={title} />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Navigation/Page Header",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const LongTitle: Story = {
  args: {
    subtitle:
      "Manage who can find your portfolio and what information appears in each published version.",
    title: "Workspace settings and publication preferences",
    width: 320,
  },
};
