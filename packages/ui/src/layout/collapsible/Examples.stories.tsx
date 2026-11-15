import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";
import { collapsibleMotionClassName } from "./styles";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <Collapsible className="rounded-lg border border-border/75 bg-card">
        <CollapsibleTrigger asChild>
          <Button
            className="group h-auto min-h-11 w-full justify-between rounded-[inherit] px-md text-card-foreground focus-visible:-outline-offset-2 aria-expanded:rounded-b-none"
            variant="ghost"
          >
            Project details
            <ChevronDown
              aria-hidden="true"
              className="motion-safe:transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={collapsibleMotionClassName}>
          <p className="mx-md border-t border-border/60 py-sm text-sm leading-relaxed text-muted-foreground">
            See what changed, who worked on it, and when it was last published.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Collapsible",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
