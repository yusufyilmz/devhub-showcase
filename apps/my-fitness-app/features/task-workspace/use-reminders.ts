"use client";
import { useEffect } from "react";

import { ScheduleService } from "@shared/services/schedule";
import type { Task, Workspace } from "@shared/services/types";
import { dateKey } from "@shared/services/types";

const remindedKinds = new Set(["meal", "supplement", "water", "workout"]);

export function useTaskReminders(state: Workspace, readOnly: boolean) {
  useEffect(() => {
    if (readOnly || !state.settings.reminders) return;
    const check = () => notifyDueTasks(state);
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, [state, readOnly]);
}

function notifyDueTasks(state: Workspace) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const date = dateKey(state.settings.timezone);
  const minutesNow = clockMinutes(state.settings.timezone);
  const day = new ScheduleService().ensureDay(state, date);
  for (const task of day.tasks) {
    if (!isDue(task, date, minutesNow, state.settings.leadMinutes)) continue;
    notifyOnce(task, date);
  }
}

function clockMinutes(timezone: string) {
  const current = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date());
  return minutesFromClock(current);
}

function isDue(task: Task, date: string, minutesNow: number, leadMinutes: number) {
  if (task.scope !== "scheduled" || task.date !== date || task.status !== "pending") return false;
  if (!task.time || !remindedKinds.has(task.kind)) return false;
  return minutesFromClock(task.time) - leadMinutes === minutesNow;
}

function minutesFromClock(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

function notifyOnce(task: Task, date: string) {
  if (!task.time) return;
  const key = `reminder:${task.id}:${task.time}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const notification = new Notification(task.title, {
    body: task.notes,
    icon: "/icon-192.png",
  });
  notification.onclick = () => {
    window.focus();
    window.location.href = `/?view=day&date=${date}&task=${encodeURIComponent(task.id)}`;
  };
}
