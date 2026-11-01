import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { QuickstartSection } from "./QuickstartSection";

const meta = {
  title: "Sections/Quickstart",
  component: QuickstartSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("quickstart"),
} satisfies Meta<typeof QuickstartSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("quickstart", "compact") };
export const Empty: Story = { args: sectionStory("quickstart", "empty") };
