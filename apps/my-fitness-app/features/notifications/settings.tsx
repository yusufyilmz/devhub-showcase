"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { notificationCapabilities } from "@shared/notifications";
import { requestWebNotificationPermission } from "@shared/notifications/client";
import { NotificationPreferences } from "@shared/ui/notification-preferences";

import {
  canInstallFitness,
  disableFitnessDevice,
  fitnessLiveState,
  fitnessNotifications,
  installFitnessPwa,
  notificationApi,
  registerFitnessDevice,
  watchFitnessInstall,
  watchFitnessLive,
} from "./browser";

export function FitnessNotificationSettings({ disabled }: { disabled: boolean }) {
  const [capabilities, setCapabilities] = useState<ReturnType<
    typeof notificationCapabilities
  > | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const liveStatus = useSyncExternalStore(watchFitnessLive, fitnessLiveState, () => "disconnected");
  const canInstall = useSyncExternalStore(watchFitnessInstall, canInstallFitness, () => false);
  useEffect(() => {
    let active = true;
    setCapabilities(notificationCapabilities());
    if (!disabled) {
      notificationApi()
        .then((value) => {
          if (active) setKey(value.publicKey);
        })
        .catch(() => undefined);
      fitnessNotifications
        .subscription()
        .then((subscription) => {
          if (active) setEnabled(Boolean(subscription));
        })
        .catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }, [disabled]);
  async function allowForeground() {
    const permission = await requestWebNotificationPermission();
    setCapabilities(notificationCapabilities());
    if (permission !== "granted")
      throw new Error("Allow notifications in your browser or device settings, then try again.");
  }
  async function enable() {
    if (!key) throw new Error("Background reminders are not configured yet.");
    await registerFitnessDevice(key);
    setEnabled(true);
    setCapabilities(notificationCapabilities());
  }
  async function disable() {
    try {
      await disableFitnessDevice();
    } finally {
      setEnabled(Boolean(await fitnessNotifications.subscription()));
    }
  }
  async function test() {
    const subscription = await fitnessNotifications.subscription();
    if (!subscription) throw new Error("Enable notifications on this device first.");
    await notificationApi("POST", { endpoint: subscription.endpoint }, "/api/notifications/test");
  }
  return (
    <NotificationPreferences
      canInstall={canInstall}
      configured={Boolean(key)}
      disabled={disabled}
      enabled={enabled}
      installed={capabilities?.installed ?? false}
      liveStatus={liveStatus}
      onAllowForeground={allowForeground}
      onDisable={disable}
      onEnable={enable}
      onInstall={installFitnessPwa}
      onTest={test}
      permission={capabilities?.permission ?? "checking"}
      requiresHomeScreen={capabilities?.requiresHomeScreen ?? false}
      supported={Boolean(capabilities?.push && capabilities.secure)}
    />
  );
}
