import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FAQSection } from "./FAQSection";

const meta = {
  args: sectionStory("faq"),
  component: FAQSection,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/FAQ Section",
} satisfies Meta<typeof FAQSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("faq", "compact") };
export const Empty: Story = { args: sectionStory("faq", "empty") };
