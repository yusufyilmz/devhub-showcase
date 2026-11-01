import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { MenuSection } from "./MenuSection";

const meta = {
  title: "Sections/Menu",
  component: MenuSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("menu"),
} satisfies Meta<typeof MenuSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("menu", "compact") };
export const Empty: Story = { args: sectionStory("menu", "empty") };
