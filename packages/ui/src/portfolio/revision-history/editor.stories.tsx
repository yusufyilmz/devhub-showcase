import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { RevisionHistory } from "./editor";

const meta = { component: RevisionHistory, title: "Studio/Revision history" } satisfies Meta<
  typeof RevisionHistory
>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  args: {
    load: async () => ({
      currentRevision: 3,
      retention: { count: 20, days: 90 },
      revisions: [{ created_at: "2026-11-03T00:00:00Z", revision: 1 }],
    }),
    onChange: () => {},
    profile,
    read: async (revision) => ({
      createdAt: "2026-11-03T00:00:00Z",
      currentRevision: 3,
      profile: { ...profile, title: "Earlier saved title" },
      revision,
    }),
    revision: 3,
  },
};
