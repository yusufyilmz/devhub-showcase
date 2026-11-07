import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MasonryGridSection } from "./MasonryGridSection";

const artworkUrl = (file: string) =>
  new URL(`./masonry/${file}.svg`, globalThis.location?.href ?? "http://localhost:6006/").href;

function masonryStory(state: "default" | "compact") {
  const args = sectionStory("gallery-grid", state);
  return {
    ...args,
    section: {
      ...args.section,
      items: [
        ...args.section.items,
        {
          body: "A tall print inspired by the contours of a landscape.",
          id: "field-notes",
          imageUrl: artworkUrl("field-notes"),
          title: "Field notes",
          url: "",
        },
        {
          body: "A square study in overlapping shapes.",
          id: "color-study",
          imageUrl: artworkUrl("color-study"),
          title: "Color study",
          url: "",
        },
      ],
      options: { ...args.section.options, description: "Portrait, landscape, and square artwork." },
    },
  };
}

const meta = {
  args: masonryStory("default"),
  component: MasonryGridSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/MasonryGrid",
} satisfies Meta<typeof MasonryGridSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: masonryStory("compact") };
export const Empty: Story = { args: sectionStory("gallery-grid", "empty") };
