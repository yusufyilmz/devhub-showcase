import type { Meta, StoryObj } from "@storybook/react-vite";

import { InlineCode } from "./InlineCode";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <p>
        Import your controls from <InlineCode>@shared/ui</InlineCode>.
      </p>
    </div>
  );
}
const meta = { title: "UI/inline-code", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
