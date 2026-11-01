import "../../styles/portfolio/sections.css";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Section } from "./Section";

const meta = {
  args: {
    children: <p>Your content belongs here.</p>,
    sectionId: "example",
    subtitle: "A quiet space for your work.",
    title: "Your story",
  },
  component: Section,
  tags: ["autodocs"],
  title: "UI/Section/Frame",
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithEyebrow: Story = { args: { eyebrow: "SELECTED WORK" } };
export const Empty: Story = { args: { children: null } };
