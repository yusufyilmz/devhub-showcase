import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { BlogPageSection } from "./BlogPageSection";

const meta = {
  title: "Sections/BlogPage",
  component: BlogPageSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("blog-page"),
} satisfies Meta<typeof BlogPageSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("blog-page", "compact") };
export const Empty: Story = { args: sectionStory("blog-page", "empty") };
