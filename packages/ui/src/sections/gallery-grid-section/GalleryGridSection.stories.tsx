import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { GalleryGridSection } from "./GalleryGridSection";

const meta = {
  args: sectionStory("gallery-grid"),
  component: GalleryGridSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/GalleryGrid",
} satisfies Meta<typeof GalleryGridSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("gallery-grid", "compact") };
export const Empty: Story = { args: sectionStory("gallery-grid", "empty") };
export const Lightbox: Story = {
  args: {
    section: {
      ...sectionStory("gallery-grid").section,
      items: [
        {
          body: "A fictional gallery example.",
          id: "gallery-one",
          imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
          title: "Mountain study",
          url: "",
        },
        {
          body: "Select a thumbnail to explore.",
          id: "gallery-two",
          imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
          title: "Landscape study",
          url: "",
        },
      ],
    },
  },
};
