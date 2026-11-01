import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddProjectButton } from "./AddProjectButton";
import { DownloadCVButton } from "./DownloadCVButton";
import { GoBackButton } from "./GoBackButton";
import { HomeButton } from "./HomeButton";
import { ProjectButton } from "./ProjectButton";

const meta = { title: "UI/Navigation actions", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Navigation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <HomeButton />
      <GoBackButton />
      <ProjectButton title="View projects" />
    </div>
  ),
};
export const ProjectActions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <AddProjectButton />
      <ProjectButton title="View projects" dark />
    </div>
  ),
};
export const Download: Story = { render: () => <DownloadCVButton /> };
