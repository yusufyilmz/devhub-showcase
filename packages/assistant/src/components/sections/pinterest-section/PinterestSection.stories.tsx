import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PinterestSection } from "./PinterestSection";

const meta = {
  args: sectionStory("pinterest"),
  component: PinterestSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/Pinterest",
} satisfies Meta<typeof PinterestSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("pinterest", "compact") };
export const Empty: Story = { args: sectionStory("pinterest", "empty") };
