import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TestimonialsSection } from "./TestimonialsSection";

const meta = {
  args: sectionStory("testimonials"),
  component: TestimonialsSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Testimonials Section",
} satisfies Meta<typeof TestimonialsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("testimonials", "compact") };
export const Empty: Story = { args: sectionStory("testimonials", "empty") };
