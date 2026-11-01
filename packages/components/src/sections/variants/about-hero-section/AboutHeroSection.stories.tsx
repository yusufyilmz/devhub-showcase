import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { AboutHeroSection } from "./AboutHeroSection";

const meta = {
  title: "Sections/AboutHero",
  component: AboutHeroSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("about-hero"),
} satisfies Meta<typeof AboutHeroSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("about-hero", "compact") };
export const Empty: Story = { args: sectionStory("about-hero", "empty") };
