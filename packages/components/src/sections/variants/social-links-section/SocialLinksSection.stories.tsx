import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { SocialLinksSection } from "./SocialLinksSection";

const meta = {
  title: "Sections/SocialLinks",
  component: SocialLinksSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("social-links"),
} satisfies Meta<typeof SocialLinksSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("social-links", "compact") };
export const Empty: Story = { args: sectionStory("social-links", "empty") };
