import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SocialLinksSection } from "./SocialLinksSection";

const meta = {
  args: sectionStory("social-links"),
  component: SocialLinksSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Social Links Section",
} satisfies Meta<typeof SocialLinksSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("social-links", "compact") };
export const Empty: Story = { args: sectionStory("social-links", "empty") };
