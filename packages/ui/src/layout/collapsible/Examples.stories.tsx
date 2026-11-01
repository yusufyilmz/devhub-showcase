import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
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
const meta = { component: Example, tags: ["autodocs"], title: "UI/collapsible" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
