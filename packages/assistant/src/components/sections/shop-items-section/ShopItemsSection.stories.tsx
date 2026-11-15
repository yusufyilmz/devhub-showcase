import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShopItemsSection } from "./ShopItemsSection";

const meta = {
  args: sectionStory("shop-items"),
  component: ShopItemsSection,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Shop Items Section",
} satisfies Meta<typeof ShopItemsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("shop-items", "compact") };
export const Empty: Story = { args: sectionStory("shop-items", "empty") };
