import "@shared/design-system/sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Section } from "./Section";

const meta = {
  title: "UI/Section/Frame",
  component: Section,
  args: {
    sectionId: "example",
    title: "Your story",
    subtitle: "A quiet space for your work.",
    children: <p>Your content belongs here.</p>,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithEyebrow: Story = { args: { eyebrow: "SELECTED WORK" } };
export const Empty: Story = { args: { children: null } };
