"use client";
import { useEffect } from "react";

import { stableNotificationId } from "@shared/notifications";
import type { Workspace } from "@shared/services/types";

import { fitnessNotifications } from "@/features/notifications/browser";
import { dueFitnessReminders } from "@/features/notifications/reminders";

export function useTaskReminders(state: Workspace, readOnly: boolean) {
  useEffect(() => {
    if (readOnly || !state.settings.reminders) return;
    const check = async () => {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      for (const reminder of dueFitnessReminders(state)) {
        const id = await stableNotificationId(`fitness-os:${reminder.key}`);
        await fitnessNotifications
          .show({
            body: reminder.notes.slice(0, 300),
            id,
            title: reminder.taskTitle.slice(0, 100),
            url: reminder.url,
          })
          .catch(() => undefined);
      }
    };
    check().catch(() => undefined);
    const timer = setInterval(() => {
      check().catch(() => undefined);
    }, 30000);
    return () => clearInterval(timer);
  }, [state, readOnly]);
}
