export type NotificationPreferencesProps = {
  disabled?: boolean;
  configured: boolean;
  enabled: boolean;
  installed: boolean;
  requiresHomeScreen: boolean;
  canInstall: boolean;
  permission: string;
  supported: boolean;
  liveStatus: string;
  onAllowForeground?: () => Promise<void>;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
  onTest: () => Promise<void>;
  onInstall: () => Promise<unknown>;
};
