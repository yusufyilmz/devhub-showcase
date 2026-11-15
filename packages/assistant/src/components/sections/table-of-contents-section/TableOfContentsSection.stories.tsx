import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TableOfContentsSection } from "./TableOfContentsSection";

const meta = {
  args: sectionStory("table-of-contents"),
  component: TableOfContentsSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Table Of Contents Section",
} satisfies Meta<typeof TableOfContentsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("table-of-contents", "compact") };
export const Empty: Story = { args: sectionStory("table-of-contents", "empty") };
