import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewsletterSection } from "./NewsletterSection";

const meta = {
  args: sectionStory("newsletter"),
  component: NewsletterSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/Newsletter",
} satisfies Meta<typeof NewsletterSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("newsletter", "compact") };
export const Empty: Story = { args: sectionStory("newsletter", "empty") };
