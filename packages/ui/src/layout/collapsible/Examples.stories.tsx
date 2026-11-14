import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <Collapsible className="overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-lg border bg-card">
        <CollapsibleTrigger asChild>
          <Button
            className="group h-auto min-h-[2.75rem] w-full justify-between rounded-none px-[0.875rem]"
            variant="ghost"
          >
            Project details
            <ChevronDown
              aria-hidden="true"
              className="motion-safe:transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ui-disclosure-motion [overflow:clip] motion-safe:[&[data-state='open']]:[animation:ui-disclosure-open_340ms_cubic-bezier(0.22,_1,_0.36,_1)] motion-safe:[&[data-state='closed']]:[animation:ui-disclosure-close_240ms_ease-in]">
          <p className="border-t px-[0.875rem] py-[0.75rem] text-sm leading-relaxed text-muted-foreground">
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
