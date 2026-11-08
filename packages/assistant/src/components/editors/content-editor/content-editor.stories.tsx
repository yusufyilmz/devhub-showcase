import { useState } from "react";

import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionContentEditor } from "./content-editor";

const meta = {
  args: { ...sectionStory("projects"), onChange: () => undefined, type: "projects" },
  component: SectionContentEditor,
  decorators: [
    (Story) => (
      <div className="w-[min(82vw,44rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  render: function Editable(args) {
    const [section, setSection] = useState(args.section);
    return <SectionContentEditor {...args} onChange={setSection} section={section} />;
  },
  tags: ["autodocs"],
  title: "UI/Editors/Content Editor",
} satisfies Meta<typeof SectionContentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = {
  args: { ...sectionStory("projects", "compact"), type: "projects" },
};
export const Empty: Story = { args: { ...sectionStory("projects", "empty"), type: "projects" } };
