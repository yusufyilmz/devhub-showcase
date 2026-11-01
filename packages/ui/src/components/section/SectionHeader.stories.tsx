import "@shared/design-system/sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "UI/Section/Header",
  component: SectionHeader,
  args: {
    title: "Selected work",
    subtitle: "A fictional collection",
    icon: <span aria-hidden="true">✳</span>,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithBadge: Story = { args: { badge: 3, variant: "card" } };
export const Minimal: Story = { args: { variant: "minimal" } };
