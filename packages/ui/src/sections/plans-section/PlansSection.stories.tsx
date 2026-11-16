import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PlansSection } from "./PlansSection";

const meta = {
  args: sectionStory("plans"),
  component: PlansSection,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Plans Section",
} satisfies Meta<typeof PlansSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("plans", "compact") };
export const Empty: Story = { args: sectionStory("plans", "empty") };

export const PlanComparison: Story = {
  args: {
    section: {
      ...meta.args.section,
      options: { ...meta.args.section.options, layout: "pricing-comparison" },
    },
  },
};
