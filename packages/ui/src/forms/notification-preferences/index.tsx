"use client";
import "./notifications.css";

import { useState } from "react";

import { BellMinus, BellPlus, BellRing, Download, type LucideIcon, Volume2 } from "lucide-react";

import { Button } from "../../buttons/button";
import { Tooltip } from "../../overlays/tooltip";
import type { NotificationPreferencesProps } from "./types";

export type { NotificationPreferencesProps } from "./types";

function DeviceAction({
  disabled,
  icon: Icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip title={label}>
      <span className="notification-preferences-action">
        <Button
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          size="icon"
          type="button"
          variant="outline"
        >
          <Icon aria-hidden="true" />
        </Button>
      </span>
    </Tooltip>
  );
}

export function NotificationPreferences(props: NotificationPreferencesProps) {
  const onAllowForeground = props.onAllowForeground;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Could not update notifications. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Device notifications" className="notification-preferences">
      <h3>Notifications on this device</h3>
      <p>
        Live updates: {props.liveStatus}. Background reminders can reach this device when the app is
        closed.
      </p>
      {props.installed && <p>The app is installed on this device.</p>}
      {props.requiresHomeScreen && (
        <p>
          On iPhone or iPad, open the browser’s Share menu, choose Add to Home Screen, and open the
          installed app. Then enable notifications here.
        </p>
      )}
      {!props.configured && (
        <p>Background delivery is not set up yet. Open-app reminders remain available.</p>
      )}
      {!props.supported && <p>This browser does not support background notifications.</p>}
      <p>
        Browser permission: {props.permission}.{" "}
        {props.enabled ? "This device is subscribed." : "This device is not subscribed."}
      </p>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <div className="notification-preferences-actions">
        {props.canInstall && (
          <DeviceAction
            disabled={busy || props.disabled}
            icon={Download}
            label="Install app"
            onClick={() => run(props.onInstall, "Installation prompt opened.")}
          />
        )}
        {onAllowForeground &&
          props.permission !== "granted" &&
          props.permission !== "unsupported" && (
            <DeviceAction
              disabled={busy || props.disabled || props.requiresHomeScreen}
              icon={Volume2}
              label="Allow open-app reminders"
              onClick={() => run(onAllowForeground, "Open-app reminders allowed on this device.")}
            />
          )}
        <DeviceAction
          disabled={
            busy ||
            props.disabled ||
            !props.configured ||
            !props.supported ||
            props.requiresHomeScreen ||
            props.enabled
          }
          icon={BellPlus}
          label="Enable notifications on this device"
          onClick={() =>
            run(
              props.onEnable,
              "Device enabled. Scheduled reminders use your reminder preference above.",
            )
          }
        />
        <DeviceAction
          disabled={busy || props.disabled || !props.enabled}
          icon={BellRing}
          label="Send test notification"
          onClick={() => run(props.onTest, "Test sent. Check this device for the notification.")}
        />
        <DeviceAction
          disabled={busy || props.disabled || !props.enabled}
          icon={BellMinus}
          label="Disable this device"
          onClick={() => run(props.onDisable, "Notifications disabled on this device.")}
        />
      </div>
    </section>
  );
}
