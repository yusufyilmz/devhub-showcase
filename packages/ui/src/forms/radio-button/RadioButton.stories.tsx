import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButton } from "./RadioButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <fieldset className="grid gap-sm">
        <legend>Portfolio visibility</legend>
        <RadioButton label="Private" name="visibility" value="private" />
        <RadioButton label="Public" name="visibility" value="public" />
        <RadioButton disabled label="Unlisted" name="visibility" value="unlisted" />
      </fieldset>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Radio Button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
