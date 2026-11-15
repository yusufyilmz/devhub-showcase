import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkExperienceSection } from "./WorkExperienceSection";

const meta = {
  args: sectionStory("work-experience"),
  component: WorkExperienceSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Work Experience Section",
} satisfies Meta<typeof WorkExperienceSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("work-experience", "compact") };
export const Empty: Story = { args: sectionStory("work-experience", "empty") };
