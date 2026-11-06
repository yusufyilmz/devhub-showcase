import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusIndicator } from "../../feedback/status-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23bfdbfe'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%231e40af'/%3E%3Cpath d='M9 48a15 15 0 0 1 30 0' fill='%231e40af'/%3E%3C/svg%3E";

const meta = {
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Display/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <AvatarImage alt="Mina Chen" src={portrait} />
        <AvatarFallback>MC</AvatarFallback>
      </>
    ),
  },
};

export const FailedImage: Story = {
  args: {
    children: (
      <>
        <AvatarImage alt="Mina Chen" src="data:image/png,invalid" />
        <AvatarFallback>MC</AvatarFallback>
      </>
    ),
    variant: "accent",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="lg" variant="primary">
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">Mina Chen</p>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <StatusIndicator ariaLabel="Online" /> Available for review
        </div>
      </div>
    </div>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "default",
          "primary",
          "secondary",
          "accent",
          "success",
          "warning",
          "destructive",
          "info",
        ] as const
      ).map((variant) => (
        <Avatar key={variant} title={variant} variant={variant}>
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
