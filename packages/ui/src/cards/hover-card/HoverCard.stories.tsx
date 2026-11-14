import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";

function Preview({ side = "top" }: { side?: "top" | "bottom" }) {
  return (
    <>
      <HoverCardTrigger asChild>
        <Button variant="outline">Mina Chen</Button>
      </HoverCardTrigger>
      <HoverCardContent side={side}>
        Designer and maintainer of the component library.
      </HoverCardContent>
    </>
  );
}

const meta = {
  args: { children: <Preview /> },
  component: HoverCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Hover Card",
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BelowTrigger: Story = { args: { children: <Preview side="bottom" /> } };
export const QuickPreview: Story = { args: { closeDelay: 0, openDelay: 0 } };

export const WidePreview: Story = {
  args: {
    children: (
      <>
        <HoverCardTrigger asChild>
          <Button variant="outline">Mina Chen</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <p className="font-semibold">Mina Chen</p>
          <p className="mt-xs text-muted-foreground">PortfolioDocumentationForContributors</p>
        </HoverCardContent>
      </>
    ),
    closeDelay: 0,
    openDelay: 0,
  },
};
