import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionButton } from "./ActionButton";
import type { ActionButtonProps } from "./types";

function Example({
  width = 560,
  ...props
}: Pick<ActionButtonProps, "colorScheme" | "loading" | "variant"> & { width?: number }) {
  return (
    <div className="w-full p-md" style={{ maxWidth: width }}>
      <ActionButton {...props}>Save changes</ActionButton>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Buttons/Action Button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
export const Outlined: Story = { args: { variant: "outlined" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Loading: Story = { args: { loading: true } };
