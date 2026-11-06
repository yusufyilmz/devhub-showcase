import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationPreferences } from "./index";

const meta = {
  args: {
    canInstall: true,
    configured: true,
    enabled: false,
    installed: false,
    liveStatus: "connected",
    onAllowForeground: async () => undefined,
    onDisable: async () => undefined,
    onEnable: async () => undefined,
    onInstall: async () => undefined,
    onTest: async () => undefined,
    permission: "default",
    requiresHomeScreen: false,
    supported: true,
  },
  component: NotificationPreferences,
  title: "UI/Forms/Device notifications",
} satisfies Meta<typeof NotificationPreferences>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const IosInstallation: StoryObj<typeof meta> = {
  args: { canInstall: false, requiresHomeScreen: true },
};
export const Subscribed: StoryObj<typeof meta> = {
  args: { enabled: true, installed: true, permission: "granted" },
};
export const SetupRequired: StoryObj<typeof meta> = { args: { configured: false } };
