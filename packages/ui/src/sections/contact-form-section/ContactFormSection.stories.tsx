import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContactFormSection } from "./ContactFormSection";

const meta = {
  args: sectionStory("contact-form"),
  component: ContactFormSection,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Contact Form Section",
} satisfies Meta<typeof ContactFormSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("contact-form", "compact") };
export const Empty: Story = { args: sectionStory("contact-form", "empty") };

export const DetailsAndForm: Story = {
  args: {
    section: {
      ...meta.args.section,
      options: { ...meta.args.section.options, layout: "contact-split" },
    },
  },
};
