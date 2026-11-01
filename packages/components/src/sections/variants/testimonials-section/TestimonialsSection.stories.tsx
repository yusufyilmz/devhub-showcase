import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { TestimonialsSection } from "./TestimonialsSection";

const meta = {
  title: "Sections/Testimonials",
  component: TestimonialsSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("testimonials"),
} satisfies Meta<typeof TestimonialsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("testimonials", "compact") };
export const Empty: Story = { args: sectionStory("testimonials", "empty") };
