import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { LegalTextSection } from "./LegalTextSection";

const meta = {
  args: sectionStory("legal-text"),
  component: LegalTextSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/LegalText",
} satisfies Meta<typeof LegalTextSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("legal-text", "compact") };
export const Empty: Story = { args: sectionStory("legal-text", "empty") };
