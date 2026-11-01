import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width, padding: 24 }}>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline">Show details</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="p-4">Your work, in context.</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
const meta = { title: "UI/collapsible", component: Example, tags: ["autodocs"] } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
