import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleHelp } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../buttons/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";
import type { TooltipProps } from "./types";

function Example(props: TooltipProps) {
  return <Tooltip {...props} />;
}

const meta = {
  args: {
    children: <Button variant="outline">Keyboard shortcuts</Button>,
    title: "Press ? to open keyboard shortcuts.",
  },
  component: Example,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Overlays/Tooltip",
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const KeyboardAndEscape: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Keyboard shortcuts" });
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(await page.findByRole("tooltip")).toHaveTextContent("Press ? to open");
    await expect(button).toHaveAccessibleDescription("Press ? to open keyboard shortcuts.");
    await userEvent.keyboard("{Escape}");
    await expect(page.queryByRole("tooltip")).not.toBeInTheDocument();
    await expect(button).toHaveFocus();
  },
};

export const IconWithLongHint: Story = {
  args: {
    children: (
      <Button aria-label="Sharing help" size="icon" variant="outline">
        <CircleHelp aria-hidden />
      </Button>
    ),
    placement: "bottom",
    title: "People with a published link can view your portfolio. Your drafts stay private.",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["default", "dark", "light", "minimal", "gradient"] as const).map((variant) => (
        <Tooltip key={variant} title={`The ${variant} appearance`} variant={variant}>
          <Button variant="outline">{variant}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Inspect selection</Button>
        </TooltipTrigger>
        <TooltipContent arrow={false} side="right">
          No arrow, with a shared hover delay
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
