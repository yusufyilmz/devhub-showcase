import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardHeader, CardTitle } from "../../cards";
import { SortableList } from "./sortable-list";

const meta = {
  args: {
    items: [
      { id: "intro", label: "Introduction" },
      { id: "work", label: "Work" },
      { id: "contact", label: "Contact" },
    ],
    label: "Section order",
    onChange: () => undefined,
  },
  component: SortableList,
  decorators: [
    (Story) => (
      <div className="w-[min(82vw,34rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  render: function Reorder(args) {
    const [items, setItems] = useState(args.items);
    return (
      <SortableList
        {...args}
        items={items}
        onChange={(ids) => setItems(ids.flatMap((id) => items.filter((item) => item.id === id)))}
      />
    );
  },
  tags: ["autodocs"],
  title: "UI/Editors/Sortable List",
} satisfies Meta<typeof SortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleItem: Story = { args: { items: [{ id: "intro", label: "Introduction" }] } };
export const Empty: Story = { args: { items: [] } };

const sections: Record<string, { title: string; description: string }> = {
  about: { description: "I design and build accessible interfaces.", title: "About" },
  projects: { description: "A collection of recent product and design work.", title: "Projects" },
  skills: { description: "Design systems, TypeScript and CSS.", title: "Skills" },
};

export const SectionPreview: Story = {
  args: {
    items: Object.entries(sections).map(([id, section]) => ({ id, label: section.title })),
    label: "Arrange portfolio sections",
    renderContent: (id) => (
      <Card>
        <CardHeader>
          <CardTitle>{sections[id]?.title}</CardTitle>
        </CardHeader>
        <CardContent>{sections[id]?.description}</CardContent>
      </Card>
    ),
  },
};
