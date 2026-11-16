import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HeroSection } from "./HeroSection";

const meta = {
  args: sectionStory("hero"),
  component: HeroSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Hero Section",
} satisfies Meta<typeof HeroSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("hero", "compact") };
export const Empty: Story = { args: sectionStory("hero", "empty") };
