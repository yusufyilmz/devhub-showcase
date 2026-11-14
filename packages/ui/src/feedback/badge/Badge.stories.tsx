import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, CountBadge, DotBadge, StatusBadge } from "./Badge";

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta: Meta<typeof Badge> = {
  args: {
    children: "Badge",
    variant: "default",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Badge content",
    },
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Feedback/Badge",
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the badge.
 */
export const Default: Story = {};

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Use the `destructive` badge to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Linked: Story = {
  render: () => (
    <Badge asChild variant="outline">
      <a href="#release-notes">Release notes</a>
    </Badge>
  ),
};

export const StatusAndCounts: Story = {
  render: () => (
    <div className="flex w-56 max-w-[70vw] flex-wrap items-center gap-s">
      <StatusBadge status="online" />
      <StatusBadge status="away" />
      <StatusBadge status="busy" />
      <StatusBadge status="offline" />
      <CountBadge count={7} />
      <CountBadge count={120} />
      <span className="inline-flex items-center gap-xs text-sm">
        <DotBadge aria-hidden="true" color="success" />
        Available
      </span>
    </div>
  ),
};
