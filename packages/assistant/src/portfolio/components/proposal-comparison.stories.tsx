import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProposalComparison } from "./proposal-comparison";

const meta = {
  args: { after: "Frontend engineer", before: "Software developer" },
  component: ProposalComparison,
  title: "Assistant/Portfolio/Proposal Comparison",
} satisfies Meta<typeof ProposalComparison>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Collections: StoryObj<typeof meta> = {
  args: { after: [{ name: "Selected work", public: false }], before: [] },
};
