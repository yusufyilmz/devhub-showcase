import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { ContactFormSection } from "./ContactFormSection";

const meta = {
  title: "Sections/ContactForm",
  component: ContactFormSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("contact-form"),
} satisfies Meta<typeof ContactFormSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("contact-form", "compact") };
export const Empty: Story = { args: sectionStory("contact-form", "empty") };
