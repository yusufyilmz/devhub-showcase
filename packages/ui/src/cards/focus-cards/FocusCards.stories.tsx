import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FocusCards } from "./FocusCards";

const meta = {
  args: {
    cards: [
      { src: cardStoryImages.morning, title: "First light" },
      { src: cardStoryImages.noon, title: "Midday" },
      { src: cardStoryImages.evening, title: "Last light" },
    ],
    className: "w-[min(88vw,48rem)]",
  },
  component: FocusCards,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Focus Cards",
} satisfies Meta<typeof FocusCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleImage: Story = {
  args: { cards: [{ src: cardStoryImages.morning, title: "First light" }] },
};
export const WithDescriptions: Story = {
  args: {
    cards: [
      { alt: "Blue hills under a clear sky", src: cardStoryImages.morning, title: "First light" },
      {
        alt: "A dark ridgeline against a purple sky",
        src: cardStoryImages.evening,
        title: "Last light",
      },
    ],
  },
};
