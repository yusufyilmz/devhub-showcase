import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink, Plus } from "lucide-react";

import { IconButton, IconButtonWithLink } from "./IconButton";
import { StyledIconButton } from "./StyledIconButton";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <div className="flex flex-wrap gap-sm">
        <IconButton aria-label="Add item">
          <Plus aria-hidden="true" />
        </IconButton>
        <IconButton aria-label="Add item" disabled>
          <Plus aria-hidden="true" />
        </IconButton>
        <IconButton aria-label="Add item" variant="outline">
          <Plus aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Buttons/Icon Button",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const PortfolioActions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-sm p-md">
      <IconButtonWithLink href="https://example.com" label="Visit portfolio">
        <ExternalLink aria-hidden="true" />
      </IconButtonWithLink>
      <StyledIconButton animated aria-label="Open updates" badgeCount={4} variant="outlined">
        <Plus aria-hidden="true" />
      </StyledIconButton>
    </div>
  ),
};
