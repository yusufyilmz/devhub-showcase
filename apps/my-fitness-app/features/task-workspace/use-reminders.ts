"use client";
import { useEffect, useState } from "react";

import { notificationCapabilities, stableNotificationId } from "@shared/notifications";
import type { Workspace } from "@shared/services/types";

import { fitnessNotifications } from "@/features/notifications/browser";
import { dueFitnessReminders } from "@/features/notifications/reminders";

export function useTaskReminders(state: Workspace, readOnly: boolean) {
  const [notice, setNotice] = useState<ReturnType<typeof dueFitnessReminders>[number]>();

  useEffect(() => {
    if (readOnly || !state.settings.reminders) return;
    const check = async () => {
      const reminders = dueFitnessReminders(state).sort((a, b) => b.dueAt - a.dueAt);
      setNotice((previous) => (previous?.key === reminders[0]?.key ? previous : reminders[0]));
      if (notificationCapabilities().permission !== "granted") return;
      for (const reminder of reminders) {
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
  return readOnly || !state.settings.reminders ? undefined : notice;
}
