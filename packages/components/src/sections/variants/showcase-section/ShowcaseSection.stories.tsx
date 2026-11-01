import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { ShowcaseSection } from "./ShowcaseSection";

const meta = {
  title: "Sections/Showcase",
  component: ShowcaseSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("showcase"),
} satisfies Meta<typeof ShowcaseSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("showcase", "compact") };
export const Empty: Story = { args: sectionStory("showcase", "empty") };
