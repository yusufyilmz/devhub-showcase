import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectsSectionPresentation } from "./ProjectsSection";

const meta = {
  args: sectionStory("projects"),
  component: ProjectsSectionPresentation,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Projects Section",
} satisfies Meta<typeof ProjectsSectionPresentation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("projects", "compact") };
export const Empty: Story = { args: sectionStory("projects", "empty") };
