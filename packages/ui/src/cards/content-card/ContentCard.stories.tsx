import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
export const Interactive: Story = { args: { onCardClick: () => undefined } };
