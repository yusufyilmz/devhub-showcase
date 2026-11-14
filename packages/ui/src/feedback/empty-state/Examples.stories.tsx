import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button/Button";
import { EmptyState } from "./EmptyState";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <EmptyState
        description="Your next idea belongs here."
        height="280px"
        title="No projects yet"
      />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Feedback/Empty State",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const WithActions: Story = {
  render: () => (
    <EmptyState
      description="Start a project or import your existing work to build your portfolio."
      height="280px"
      title="No projects yet"
    >
      <Button asChild size="sm" variant="secondary">
        <a href="#import">Import project</a>
      </Button>
      <Button asChild size="sm">
        <a href="#create">Create project</a>
      </Button>
    </EmptyState>
  ),
};
