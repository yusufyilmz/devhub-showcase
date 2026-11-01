import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PostsGridSection } from "./PostsGridSection";

const meta = {
  args: sectionStory("posts-grid"),
  component: PostsGridSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/PostsGrid",
} satisfies Meta<typeof PostsGridSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("posts-grid", "compact") };
export const Empty: Story = { args: sectionStory("posts-grid", "empty") };
