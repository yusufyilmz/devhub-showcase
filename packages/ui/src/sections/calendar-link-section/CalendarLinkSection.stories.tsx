import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CalendarLinkSection } from "./CalendarLinkSection";

const meta = {
  args: sectionStory("calendar-link"),
  component: CalendarLinkSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/CalendarLink",
} satisfies Meta<typeof CalendarLinkSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("calendar-link", "compact") };
export const Empty: Story = { args: sectionStory("calendar-link", "empty") };
