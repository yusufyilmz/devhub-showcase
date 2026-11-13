import type { Meta, StoryObj } from "@storybook/react-vite";

import { RevealCard } from "./RevealCard";

const meta = {
  args: {
    brief: "An introduction to the project.",
    children: <p>The project involved three teams over six weeks.</p>,
    heading: <h3>Project overview</h3>,
    title: "Project overview",
  },
  component: RevealCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Reveal Card",
} satisfies Meta<typeof RevealCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PinnedDetails: Story = { args: { pinOnDetailsClick: true } };
export const WithoutBrief: Story = { args: { brief: null } };
