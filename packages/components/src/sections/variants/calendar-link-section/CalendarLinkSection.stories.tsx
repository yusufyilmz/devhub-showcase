import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { CalendarLinkSection } from "./CalendarLinkSection";

const meta = {
  title: "Sections/CalendarLink",
  component: CalendarLinkSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("calendar-link"),
} satisfies Meta<typeof CalendarLinkSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("calendar-link", "compact") };
export const Empty: Story = { args: sectionStory("calendar-link", "empty") };
