import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TechnicalSkillsSection } from "./TechnicalSkillsSection";

const meta = {
  args: sectionStory("technical-skills"),
  component: TechnicalSkillsSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/TechnicalSkills",
} satisfies Meta<typeof TechnicalSkillsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("technical-skills", "compact") };
export const Empty: Story = { args: sectionStory("technical-skills", "empty") };
