import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectButton } from "./ProjectButton";

const meta = {
  args: { title: "View projects" },
  component: ProjectButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Actions/Project Button",
} satisfies Meta<typeof ProjectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkSurface: Story = { args: { dark: true } };
export const CustomLabel: Story = { args: { title: "Explore selected work" } };
