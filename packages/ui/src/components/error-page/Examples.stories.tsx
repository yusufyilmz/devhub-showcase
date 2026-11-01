import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorPage } from "./ErrorPage";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <ErrorPage />
    </div>
  );
}
const meta = { title: "UI/error-page", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
