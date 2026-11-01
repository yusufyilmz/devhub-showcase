import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { StudiesSection } from "./StudiesSection";

const meta = {
  title: "Sections/Studies",
  component: StudiesSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("studies"),
} satisfies Meta<typeof StudiesSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("studies", "compact") };
export const Empty: Story = { args: sectionStory("studies", "empty") };
