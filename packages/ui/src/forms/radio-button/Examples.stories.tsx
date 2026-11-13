import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButton } from "./RadioButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <fieldset className="grid gap-3">
        <legend>Portfolio visibility</legend>
        <RadioButton label="Private" name="visibility" value="private" />
        <RadioButton label="Public" name="visibility" value="public" />
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
