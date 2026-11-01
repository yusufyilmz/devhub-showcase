import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { WorkExperienceSection } from "./WorkExperienceSection";

const meta = {
  title: "Sections/WorkExperience",
  component: WorkExperienceSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("work-experience"),
} satisfies Meta<typeof WorkExperienceSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("work-experience", "compact") };
export const Empty: Story = { args: sectionStory("work-experience", "empty") };
