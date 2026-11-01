import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContactInfoSection } from "./ContactInfoSection";

const meta = {
  args: sectionStory("contact-info"),
  component: ContactInfoSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/ContactInfo",
} satisfies Meta<typeof ContactInfoSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("contact-info", "compact") };
export const Empty: Story = { args: sectionStory("contact-info", "empty") };
