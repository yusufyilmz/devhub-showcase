import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountSupport } from "./screen";
import type { SupportSummary } from "./types";

const account = {
  confirmed: true,
  created_at: "2026-11-04T10:00:00Z",
  id: "11111111-1111-4111-8111-111111111111",
};
const summary: SupportSummary = {
  ...account,
  audit: [],
  billing: {
    active: true,
    chatEnabled: true,
    chatLimit: 100,
    chatUsed: 3,
    editorLimit: 10,
    editorUsed: 1,
    plan: "pro",
    status: "active",
  },
  profiles: [{ cvPublished: false, id: "example", revision: 3, websitePublished: true }],
};
const meta = {
  args: {
    disable: async () => undefined,
    inspect: async () => summary,
    load: async () => ({ accounts: [account] }),
  },
  component: AccountSupport,
  title: "Studio/Account support",
} satisfies Meta<typeof AccountSupport>;
export default meta;
type Story = StoryObj<typeof meta>;
export const MetadataOnly: Story = {};
