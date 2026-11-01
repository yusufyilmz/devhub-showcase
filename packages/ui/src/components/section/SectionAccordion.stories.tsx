import "@shared/design-system/sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionAccordion } from "./SectionElements";

const items = [
  {
    id: "one",
    title: "First project",
    content: <p>A thoughtful introduction to a fictional project.</p>,
  },
  { id: "two", title: "Second project", content: <p>Another perspective on your work.</p> },
  { id: "three", title: "Third project", content: <p>A little room to grow.</p> },
];
const meta = {
  title: "UI/Section/SectionAccordion",
  component: SectionAccordion,
  args: { label: "Selected work", items },
  tags: ["autodocs"],
} satisfies Meta<typeof SectionAccordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const LongTitles: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      title: item.title + " with a longer title to check wrapping on small screens",
    })),
  },
};
