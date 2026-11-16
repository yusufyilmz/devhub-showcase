import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { QuickstartSection } from "./QuickstartSection";

const meta = {
  args: sectionStory("quickstart"),
  component: QuickstartSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Quickstart Section",
} satisfies Meta<typeof QuickstartSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("quickstart", "compact") };
export const Empty: Story = { args: sectionStory("quickstart", "empty") };
