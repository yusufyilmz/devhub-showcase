import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { LegalTextSection } from "./LegalTextSection";

const meta = {
  title: "Sections/LegalText",
  component: LegalTextSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("legal-text"),
} satisfies Meta<typeof LegalTextSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("legal-text", "compact") };
export const Empty: Story = { args: sectionStory("legal-text", "empty") };
