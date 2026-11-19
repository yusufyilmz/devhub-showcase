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
      <div className="studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px] studio-editor [&_.editor-workspace-body]:[padding-top:32px] min-[768px]:[&_.editor-workspace-body]:[padding-left:var(--editor-sidebar-gap,_16px)] max-[767px]:[&_.editor-workspace-body]:[padding-top:0] [&_>_.editor-companion[data-placement='floating']]:[--agent-launcher-size:clamp(3.75rem,_8vw,_5.25rem)] min-h-svh bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_50%),var(--background)]">
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
