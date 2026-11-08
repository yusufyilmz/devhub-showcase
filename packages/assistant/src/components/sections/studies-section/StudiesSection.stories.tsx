import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudiesSection } from "./StudiesSection";

const meta = {
  args: sectionStory("studies"),
  component: StudiesSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/Studies",
} satisfies Meta<typeof StudiesSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("studies", "compact") };
export const Empty: Story = { args: sectionStory("studies", "empty") };
