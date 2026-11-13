import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ExpandableCards } from "./ExpandableCards";

const meta = {
  args: {
    cards: [
      {
        content: <p>Read the research notes from the first round of interviews.</p>,
        id: "field-notes",
        title: "Storybook App UI/Cards/Expandable Cards/Expandablecards",
      },
      {
        content: <p>Explore the signage study and its first prototype.</p>,
        id: "wayfinding",
        title: "Wayfinding",
      },
    ],
  },
  component: ExpandableCards,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Expandable Cards",
} satisfies Meta<typeof ExpandableCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithThumbnail: Story = {
  args: {
    cards: [
      {
        content: <p>The shoot took place across three mornings in the same valley.</p>,
        description: "A landscape photography project.",
        id: "ridge",
        thumbnail: cardStoryImages.morning,
        title: "Ridgeline",
      },
    ],
  },
};
export const Empty: Story = { args: { cards: [] } };
