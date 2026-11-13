import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionCarousel } from "./SectionCarousel";

const items = [
  {
    content: <p>A thoughtful introduction to a fictional project.</p>,
    id: "one",
    title: "First project",
  },
  { content: <p>Another perspective on your work.</p>, id: "two", title: "Second project" },
  { content: <p>A little room to grow.</p>, id: "three", title: "Third project" },
];
const meta = {
  args: { items, label: "Selected work" },
  component: SectionCarousel,
  tags: ["autodocs"],
  title: "UI/Layout/Section/Section Carousel",
} satisfies Meta<typeof SectionCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const LongTitles: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      title: `${item.title} with a longer title to check wrapping on small screens`,
    })),
  },
};
