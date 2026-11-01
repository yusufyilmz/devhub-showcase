import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { GalleryGridSection } from "./GalleryGridSection";

const meta = {
  title: "Sections/GalleryGrid",
  component: GalleryGridSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("gallery-grid"),
} satisfies Meta<typeof GalleryGridSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("gallery-grid", "compact") };
export const Empty: Story = { args: sectionStory("gallery-grid", "empty") };
