import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { ContactInfoSection } from "./ContactInfoSection";

const meta = {
  title: "Sections/ContactInfo",
  component: ContactInfoSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("contact-info"),
} satisfies Meta<typeof ContactInfoSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("contact-info", "compact") };
export const Empty: Story = { args: sectionStory("contact-info", "empty") };
