"use client";

import { useState } from "react";

import {
  Bell,
  BellMinus,
  BellPlus,
  BellRing,
  Download,
  type LucideIcon,
  Volume2,
} from "lucide-react";

import { Button } from "../../buttons/button";
import { Alert, AlertDescription } from "../../feedback/alert";
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
    <Button
      className="h-auto min-h-10 max-w-full justify-start py-2 whitespace-normal text-start"
      disabled={disabled}
      onClick={onClick}
      size="sm"
      startIcon={<Icon aria-hidden="true" />}
      type="button"
      variant="outline"
    >
      {label}
    </Button>
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
    <section
      aria-label="Device notifications"
      className="my-md grid min-w-0 gap-md rounded-xl border border-border/70 bg-card p-md text-card-foreground"
    >
      <div className="flex items-start gap-sm">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Bell aria-hidden="true" className="size-4" />
        </span>
        <div className="grid min-w-0 gap-xs">
          <h3 className="m-0 text-base leading-snug font-semibold">Notifications on this device</h3>
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            Live updates: {props.liveStatus}. Background reminders can reach this device when the
            app is closed.
          </p>
        </div>
      </div>
      <div className="grid min-w-0 gap-xs text-sm leading-relaxed wrap-anywhere text-muted-foreground [&_p]:m-0">
        {props.installed && <p>The app is installed on this device.</p>}
        {props.requiresHomeScreen && (
          <p>
            On iPhone or iPad, open the browser’s Share menu, choose Add to Home Screen, and open
            the installed app. Then enable notifications here.
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
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert role="status">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-xs border-t border-border/70 pt-sm sm:flex sm:flex-wrap">
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
