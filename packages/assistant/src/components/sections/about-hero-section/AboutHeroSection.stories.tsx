import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AboutHeroSection } from "./AboutHeroSection";

const meta = {
  args: sectionStory("about-hero"),
  component: AboutHeroSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/About Hero Section",
} satisfies Meta<typeof AboutHeroSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("about-hero", "compact") };
export const Empty: Story = { args: sectionStory("about-hero", "empty") };
