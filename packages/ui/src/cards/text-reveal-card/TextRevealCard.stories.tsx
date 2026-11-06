import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextRevealCard } from "./TextRevealCard";

const meta = {
  args: {
    revealText:
      "Reviewers found the mobile navigation easier to use after the labels were made visible.",
    text: "Show research finding",
  },
  component: TextRevealCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Text Reveal Card",
} satisfies Meta<typeof TextRevealCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithNote: Story = {
  args: { children: <p className="mt-2">The updated design is included in the next review.</p> },
};
export const LongLabel: Story = {
  args: { text: "What changed after the first round of accessibility testing?" },
};
