import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DashboardSection } from "./DashboardSection";

const meta = {
  args: sectionStory("dashboard"),
  component: DashboardSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Dashboard Section",
} satisfies Meta<typeof DashboardSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("dashboard", "compact") };
export const Empty: Story = { args: sectionStory("dashboard", "empty") };
