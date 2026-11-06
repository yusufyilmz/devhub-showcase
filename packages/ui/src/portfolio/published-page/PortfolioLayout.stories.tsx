import { pageProfile } from "@fixtures/page-profile";
import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioLayout } from "./PortfolioLayout";

const meta = {
  args: { profile: pageProfile, username: "alex-morgan" },
  component: PortfolioLayout,
  decorators: [
    (Story, { globals }) => (
      <PortfolioStoryFrame fullBleed mode={globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Portfolio",
} satisfies Meta<typeof PortfolioLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Designer: Story = {};
export const Consultant: Story = {
  args: { profile: { ...pageProfile, portfolioType: "consultant" } },
};
export const Minimal: Story = {
  args: { profile: { ...pageProfile, portfolioType: "minimal" } },
};
