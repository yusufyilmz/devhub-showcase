import { useState } from "react";

import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OptionsEditor } from "./options-editor";

const meta = {
  args: { ...sectionStory("gallery-grid"), onChange: () => undefined, type: "gallery-grid" },
  component: OptionsEditor,
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
    return <OptionsEditor {...args} onChange={setSection} section={section} />;
  },
  tags: ["autodocs"],
  title: "Assistant/Editors/Options Editor",
} satisfies Meta<typeof OptionsEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MapOptions: Story = { args: { ...sectionStory("map"), type: "map" } };
export const Newsletter: Story = { args: { ...sectionStory("newsletter"), type: "newsletter" } };
