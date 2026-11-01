import type { Meta, StoryObj } from "@storybook/react-vite";

import { SnackbarNotification } from "./Notification";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <SnackbarNotification
        message="Saved to your draft"
        severity="success"
        open
        onClose={() => undefined}
      />
    </div>
  );
}
const meta = { title: "UI/notification", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
