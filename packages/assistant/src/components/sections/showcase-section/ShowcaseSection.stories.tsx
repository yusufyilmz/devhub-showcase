import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShowcaseSection } from "./ShowcaseSection";

const meta = {
  args: sectionStory("showcase"),
  component: ShowcaseSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/Showcase",
} satisfies Meta<typeof ShowcaseSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("showcase", "compact") };
export const Empty: Story = { args: sectionStory("showcase", "empty") };
