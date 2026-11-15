import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddProjectButton } from "./AddProjectButton";

const meta = {
  component: AddProjectButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Buttons/Add Project Button",
} satisfies Meta<typeof AddProjectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InToolbar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-between gap-sm">
      <h2 className="text-base font-semibold">Projects</h2>
      <AddProjectButton />
    </div>
  ),
};
export const EmptyProjectList: Story = {
  render: () => (
    <div className="grid justify-items-start gap-sm rounded-xl border border-border/75 bg-card p-md">
      <p className="text-sm text-muted-foreground">No projects yet.</p>
      <AddProjectButton />
    </div>
  ),
};
