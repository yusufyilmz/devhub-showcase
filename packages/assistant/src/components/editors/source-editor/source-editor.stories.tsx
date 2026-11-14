import { useState } from "react";

import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SourceEditor } from "./source-editor";

const meta = {
  args: { ...sectionStory("gallery-grid"), onChange: () => undefined, type: "gallery-grid" },
  component: SourceEditor,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  render: function Editable(args) {
    const [section, setSection] = useState(args.section);
    return <SourceEditor {...args} onChange={setSection} section={section} />;
  },
  tags: ["autodocs"],
  title: "Assistant/Editors/Source Editor",
} satisfies Meta<typeof SourceEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ProfileAbout: Story = {
  args: {
    ...sectionStory("about"),
    section: { ...sectionStory("about").section, source: { field: "about", type: "profile" } },
    type: "about",
  },
};
export const WithoutSources: Story = { args: { ...sectionStory("heading"), type: "heading" } };
