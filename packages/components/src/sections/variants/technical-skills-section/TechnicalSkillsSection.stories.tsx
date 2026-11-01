import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { TechnicalSkillsSection } from "./TechnicalSkillsSection";

const meta = {
  title: "Sections/TechnicalSkills",
  component: TechnicalSkillsSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("technical-skills"),
} satisfies Meta<typeof TechnicalSkillsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("technical-skills", "compact") };
export const Empty: Story = { args: sectionStory("technical-skills", "empty") };
