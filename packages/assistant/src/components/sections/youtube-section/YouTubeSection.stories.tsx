import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { YouTubeSection } from "./YouTubeSection";

const meta = {
  args: sectionStory("youtube"),
  component: YouTubeSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/YouTube",
} satisfies Meta<typeof YouTubeSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("youtube", "compact") };
export const Empty: Story = { args: sectionStory("youtube", "empty") };
