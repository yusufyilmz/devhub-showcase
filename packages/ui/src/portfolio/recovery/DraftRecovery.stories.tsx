import type { Meta, StoryObj } from "@storybook/react-vite";

import { DraftRecovery } from "./DraftRecovery";

const noop = () => {
  /* Static presentation story; persistence is exercised in browser tests. */
};
const recovery = {
  candidate: null,
  conflict: noop,
  discard: noop,
  restore: noop,
  retry: noop,
  saved: noop,
  stale: false,
  status: "saved" as const,
  stop: noop,
};
const meta = {
  args: { recovery },
  component: DraftRecovery,
  title: "Studio/Draft recovery",
} satisfies Meta<typeof DraftRecovery>;
export default meta;
export const Saved: StoryObj<typeof meta> = {};
export const Failed: StoryObj<typeof meta> = {
  args: { recovery: { ...recovery, status: "failed" } },
};
export const Conflict: StoryObj<typeof meta> = { args: { recovery: { ...recovery, stale: true } } };
