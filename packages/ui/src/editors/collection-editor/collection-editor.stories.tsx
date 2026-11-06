import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "../../forms/field";

const sampleItems = [
  { id: "intro", title: "Introduction" },
  { id: "work", title: "Selected work" },
];

import { CollectionEditor } from "./collection-editor";

function Example({
  items: initialItems,
  maxItems,
}: {
  items: typeof sampleItems;
  maxItems?: number;
}) {
  const [items, setItems] = useState(initialItems);
  return (
    <CollectionEditor
      create={() => ({ id: crypto.randomUUID(), title: "Untitled" })}
      getTitle={(item) => item.title}
      items={items}
      maxItems={maxItems}
      onChange={setItems}
      render={(item, change) => (
        <Field label="Title" onChange={(title) => change({ ...item, title })} value={item.title} />
      )}
      title="Projects"
    />
  );
}

const meta = {
  args: { items: sampleItems },
  component: Example,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Editors/Collection Editor",
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const AtCapacity: Story = { args: { maxItems: 2 } };
