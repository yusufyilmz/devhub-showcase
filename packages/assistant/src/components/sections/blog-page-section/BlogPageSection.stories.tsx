import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { BlogPageSection } from "./BlogPageSection";

const meta = {
  args: sectionStory("blog-page"),
  component: BlogPageSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Blog Page Section",
} satisfies Meta<typeof BlogPageSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("blog-page", "compact") };
export const Empty: Story = { args: sectionStory("blog-page", "empty") };
