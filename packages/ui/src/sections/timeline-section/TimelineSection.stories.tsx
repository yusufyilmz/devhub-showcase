import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelineSection } from "./TimelineSection";

const meta = {
  args: sectionStory("timeline"),
  component: TimelineSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Timeline Section",
} satisfies Meta<typeof TimelineSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("timeline", "compact") };
export const Empty: Story = { args: sectionStory("timeline", "empty") };
