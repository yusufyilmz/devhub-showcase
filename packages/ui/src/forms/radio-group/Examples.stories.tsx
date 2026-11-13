import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup, RadioGroupItem } from "./RadioGroup";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <RadioGroup aria-label="Layout" defaultValue="classic">
        <div className="flex gap-2">
          <RadioGroupItem id="classic" value="classic" />
          <label htmlFor="classic">Classic</label>
        </div>
        <div className="flex gap-2">
          <RadioGroupItem id="editorial" value="editorial" />
          <label htmlFor="editorial">Editorial</label>
        </div>
      </RadioGroup>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Radio Group",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
