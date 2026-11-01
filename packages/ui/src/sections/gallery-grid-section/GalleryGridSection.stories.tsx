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
