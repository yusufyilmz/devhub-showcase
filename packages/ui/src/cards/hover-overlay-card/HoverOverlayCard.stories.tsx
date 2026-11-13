import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HoverOverlayCard } from "./HoverOverlayCard";

const meta = {
  args: {
    className: "w-[min(84vw,22rem)]",
    description: "Hover to preview the landscape after sunset.",
    hoverImage: cardStoryImages.evening,
    image: cardStoryImages.morning,
    title: "Evening landscape",
  },
  component: HoverOverlayCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Hover Overlay Card",
} satisfies Meta<typeof HoverOverlayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TitleOnly: Story = { args: { description: undefined } };
export const ReverseImages: Story = {
  args: { hoverImage: cardStoryImages.morning, image: cardStoryImages.evening },
};
