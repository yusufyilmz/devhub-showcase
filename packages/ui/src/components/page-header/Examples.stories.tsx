import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageHeader } from "./PageHeader";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <PageHeader title="Your studio" subtitle="A place for your next chapter." />
    </div>
  );
}
const meta = { title: "UI/page-header", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
