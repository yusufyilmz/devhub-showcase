import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AwardsSection } from "./AwardsSection";

const meta = {
  args: sectionStory("awards"),
  component: AwardsSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Awards Section",
} satisfies Meta<typeof AwardsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("awards", "compact") };
export const Empty: Story = { args: sectionStory("awards", "empty") };
