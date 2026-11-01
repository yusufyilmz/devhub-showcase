import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { NewsletterSection } from "./NewsletterSection";

const meta = {
  title: "Sections/Newsletter",
  component: NewsletterSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("newsletter"),
} satisfies Meta<typeof NewsletterSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("newsletter", "compact") };
export const Empty: Story = { args: sectionStory("newsletter", "empty") };
