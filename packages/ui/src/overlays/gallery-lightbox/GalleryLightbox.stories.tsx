import { useState } from "react";

import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { GalleryLightbox } from "./GalleryLightbox";

const items = [
  {
    // biome-ignore lint/performance/noImgElement: The fixture is a local data URL.
    content: <img alt="Blue hills" src={cardStoryImages.morning} />,
    id: "morning",
    thumbnail: "1",
    title: "First light",
  },
  {
    // biome-ignore lint/performance/noImgElement: The fixture is a local data URL.
    content: <img alt="Purple hills" src={cardStoryImages.evening} />,
    id: "evening",
    thumbnail: "2",
    title: "Last light",
  },
];

const meta = {
  args: { index: null, items, onIndexChange: () => undefined },
  component: GalleryLightbox,
  parameters: { layout: "centered" },
  render: function Gallery(args) {
    const [index, setIndex] = useState(args.index);
    return (
      <>
        <Button onClick={() => setIndex(0)}>Open gallery</Button>
        <GalleryLightbox {...args} index={index} onIndexChange={setIndex} />
      </>
    );
  },
  tags: ["autodocs"],
  title: "UI/Overlays/Gallery Lightbox",
} satisfies Meta<typeof GalleryLightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StartsOpen: Story = { args: { index: 0 } };
export const SingleItem: Story = { args: { items: items.slice(0, 1) } };
