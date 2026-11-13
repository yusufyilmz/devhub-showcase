import "./sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeader } from "./SectionHeader";

const meta = {
  args: {
    icon: <span aria-hidden="true">✳</span>,
    subtitle: "A fictional collection",
    title: "Storybook App UI/Layout/Section/Sectionheader",
  },
  component: SectionHeader,
  tags: ["autodocs"],
  title: "UI/Layout/Section/Section Header",
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithBadge: Story = { args: { badge: 3, variant: "card" } };
export const Minimal: Story = { args: { variant: "minimal" } };
