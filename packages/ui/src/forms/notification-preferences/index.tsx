"use client";
import "./notifications.css";

import { useState } from "react";

import { Button } from "../../buttons/button";
import type { NotificationPreferencesProps } from "./types";

export type { NotificationPreferencesProps } from "./types";

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
      {props.canInstall && (
        <Button
          disabled={busy || props.disabled}
          onClick={() => run(props.onInstall, "Installation prompt opened.")}
          type="button"
          variant="unstyled"
        >
          Install app
        </Button>
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
      {onAllowForeground &&
        props.permission !== "granted" &&
        props.permission !== "unsupported" && (
          <Button
            disabled={busy || props.disabled || props.requiresHomeScreen}
            onClick={() => run(onAllowForeground, "Open-app reminders allowed on this device.")}
            type="button"
            variant="unstyled"
          >
            Allow open-app reminders
          </Button>
        )}
      <div className="notification-preferences-actions">
        <Button
          disabled={
            busy ||
            props.disabled ||
            !props.configured ||
            !props.supported ||
            props.requiresHomeScreen ||
            props.enabled
          }
          onClick={() =>
            run(
              props.onEnable,
              "Device enabled. Scheduled reminders use your reminder preference above.",
            )
          }
          type="button"
          variant="unstyled"
        >
          Enable notifications on this device
        </Button>
        <Button
          disabled={busy || props.disabled || !props.enabled}
          onClick={() => run(props.onTest, "Test sent. Check this device for the notification.")}
          type="button"
          variant="unstyled"
        >
          Send test notification
        </Button>
        <Button
          disabled={busy || props.disabled || !props.enabled}
          onClick={() => run(props.onDisable, "Notifications disabled on this device.")}
          type="button"
          variant="unstyled"
        >
          Disable this device
        </Button>
      </div>
    </section>
  );
}
