import "./sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Section } from "./Section";

const meta = {
  args: {
    children: <p>Your content belongs here.</p>,
    sectionId: "example",
    subtitle: "A quiet space for your work.",
    title: "Storybook App UI/Layout/Section",
  },
  component: Section,
  tags: ["autodocs"],
  title: "UI/Layout/Section",
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithEyebrow: Story = { args: { eyebrow: "SELECTED WORK" } };
export const Empty: Story = { args: { children: null } };
