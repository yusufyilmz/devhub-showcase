import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { ProfileFields } from "../profile-fields";
import { DraftPreviewPane } from "./draft-preview-pane";
import { EditorWorkspace } from "./editor-workspace";

const meta = {
  component: EditorWorkspace,
  parameters: { layout: "fullscreen" },
  title: "Assistant/Portfolio/Editor Workspace",
} satisfies Meta<typeof EditorWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Profile: Story = {
  args: {
    active: "Profile",
    children: null,
    groups: [
      { items: ["Profile", "Experience", "Projects"], label: "Content" },
      { items: ["Publishing"], label: "Settings" },
    ],
    onNavigate: () => undefined,
    preview: null,
    username: "fictional-owner",
  },
  render: function Render(args) {
    const [active, setActive] = useState(args.active);
    const [draft, setDraft] = useState(profile);
    return (
      <div className="admin-shell studio studio-editor">
        <EditorWorkspace
          {...args}
          active={active}
          onNavigate={setActive}
          preview={
            <DraftPreviewPane downloadHref="#" profile={draft}>
              <p>Private website preview</p>
            </DraftPreviewPane>
          }
        >
          <ProfileFields onChange={setDraft} profile={draft} />
        </EditorWorkspace>
      </div>
    );
  },
};
