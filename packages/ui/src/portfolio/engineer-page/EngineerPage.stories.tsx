import { pageProfile } from "@fixtures/page-profile";
import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { EngineerPage } from "./EngineerPage";

const meta = {
  args: {
    profile: {
      ...pageProfile,
      portfolioType: "engineer",
      sectionSettings: {
        projects: { renderer: "project-cards" },
        skills: { renderer: "skill-list" },
      },
      title: "Software engineer",
    },
    resources: { educations: [], experiences: [], projects: [], referrals: [], skills: {} },
  },
  component: EngineerPage,
  decorators: [
    (Story, { globals }) => (
      <PortfolioStoryFrame fullBleed mode={globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Engineer Portfolio",
} satisfies Meta<typeof EngineerPage>;

export default meta;
export const Published: StoryObj<typeof meta> = {};
