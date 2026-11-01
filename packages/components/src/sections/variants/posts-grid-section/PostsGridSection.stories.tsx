import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { PostsGridSection } from "./PostsGridSection";

const meta = {
  title: "Sections/PostsGrid",
  component: PostsGridSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("posts-grid"),
} satisfies Meta<typeof PostsGridSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("posts-grid", "compact") };
export const Empty: Story = { args: sectionStory("posts-grid", "empty") };
