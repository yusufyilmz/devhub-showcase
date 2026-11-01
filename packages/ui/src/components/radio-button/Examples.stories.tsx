import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButton } from "./RadioButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <fieldset className="grid gap-3">
        <legend>Portfolio visibility</legend>
        <RadioButton name="visibility" value="private" label="Private" />
        <RadioButton name="visibility" value="public" label="Public" />
      </fieldset>
    </div>
  );
}
const meta = { title: "UI/radio-button", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
