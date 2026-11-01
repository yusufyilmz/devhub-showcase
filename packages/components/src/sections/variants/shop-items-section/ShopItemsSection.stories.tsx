import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { sectionStory } from "../../__fixtures__/section-story";
import { ShopItemsSection } from "./ShopItemsSection";

const meta = {
  title: "Sections/ShopItems",
  component: ShopItemsSection,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  args: sectionStory("shop-items"),
} satisfies Meta<typeof ShopItemsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: sectionStory("shop-items", "compact") };
export const Empty: Story = { args: sectionStory("shop-items", "empty") };
