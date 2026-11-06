import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddProjectButton } from "./AddProjectButton";

const meta = {
  component: AddProjectButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Actions/Add Project Button",
} satisfies Meta<typeof AddProjectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InToolbar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <h2>Projects</h2>
      <AddProjectButton />
    </div>
  ),
};
export const EmptyProjectList: Story = {
  render: () => (
    <div className="space-y-3 rounded-lg border p-5">
      <p>No projects yet.</p>
      <AddProjectButton />
    </div>
  ),
};
