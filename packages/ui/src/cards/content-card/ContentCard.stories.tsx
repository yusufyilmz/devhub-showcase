import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { ContentCard } from "./ContentCard";

const meta = {
  args: {
    className: "w-[min(85vw,26rem)]",
    description: "Findings from a week of research.",
    title: "Research notes",
    variant: "solid",
  },
  component: ContentCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Content Card",
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAuthor: Story = {
  args: { author: { name: "Mina Chen", subtitle: "Designer" }, metadata: "5 min read" },
};
export const Split: Story = {
  args: { backgroundImage: cardStoryImages.morning, layout: "split", variant: "default" },
};
export const Gradient: Story = { args: { variant: "gradient" } };
export const Minimal: Story = { args: { variant: "minimal" } };
export const Interactive: Story = {
  args: { onCardClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole("button", { name: /research notes/i });
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard("{Enter} ");
    await expect(args.onCardClick).toHaveBeenCalledTimes(2);
  },
};

export const LongContent: Story = {
  args: {
    author: { name: "Mina Chen", subtitle: "Research and design" },
    description:
      "The team reorganized the workspace after testing how people found recent projects, switched between accounts, and returned to unfinished tasks. The revised navigation keeps these actions visible as the available space changes.",
    layout: "stacked",
    metadata: "12 min read",
    size: "sm",
    title: "What we learned from redesigning the workspace navigation for small screens",
  },
};
