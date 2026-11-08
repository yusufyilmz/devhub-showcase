import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MapSection } from "./MapSection";

const meta = {
  args: sectionStory("map"),
  component: MapSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Sections/Map",
} satisfies Meta<typeof MapSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("map", "compact") };
export const Empty: Story = { args: sectionStory("map", "empty") };
