import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { PublicationControls } from "./editor";

const meta = { component: PublicationControls, title: "Studio/Publication" } satisfies Meta<
  typeof PublicationControls
>;
export default meta;
export const SavedDraft: StoryObj<typeof meta> = {
  args: {
    change: async () => {},
    dirty: false,
    disabled: false,
    load: async () => ({
      currentRevision: 3,
      published: { revision: 1, updated_at: "2026-11-03", username: "example-owner" },
    }),
    onChanged: () => {},
    profile,
    revision: 3,
  },
};
